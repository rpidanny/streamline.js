import { performance } from 'perf_hooks'
import toReadableStream from 'to-readable-stream'

import { processJson } from '../../src'

describe('Process JSON', () => {
  let readStream: NodeJS.ReadableStream
  const testData1 = { id: 0, name: 'Annapurna' }
  const testData2 = { id: 1, name: 'Machapuchare' }

  beforeEach(() => {
    readStream = toReadableStream(
      `${JSON.stringify(testData1)}\n${JSON.stringify(testData2)}`,
    ) as NodeJS.ReadableStream
  })

  it('should read the stream and call handler for each line', async () => {
    const expectedValues = [testData2, testData1]
    await processJson(readStream, async (item: Record<string, unknown>) => {
      expect(item).toEqual(expectedValues.pop())
    })
  })

  describe('Concurrency', () => {
    const delayMillis = 500
    const prescaler = 100

    it('should process items in sequence', async () => {
      const start = performance.now()
      await processJson(readStream, async (_item: Record<string, unknown>) => {
        await new Promise((r) => setTimeout(r, delayMillis))
      })
      const end = performance.now()
      const executionTime = end - start
      expect(Math.floor(executionTime / prescaler)).toEqual((delayMillis * 2) / prescaler)
    })

    it('should process items in parallel', async () => {
      const start = performance.now()
      await processJson(
        readStream,
        async (_item: Record<string, unknown>) => {
          await new Promise((r) => setTimeout(r, delayMillis))
        },
        2,
      )
      const end = performance.now()
      const executionTime = end - start
      expect(Math.floor(executionTime / prescaler)).toEqual(delayMillis / prescaler)
    })
  })
})
