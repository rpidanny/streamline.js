import { performance } from 'perf_hooks'
import toReadableStream from 'to-readable-stream'

import { processCsv } from '../../../src'

describe('Process CSV', () => {
  let readStream: NodeJS.ReadStream
  const header = {
    raw: '"id", "name"',
    parsed: ['id', 'name'],
  }
  const body = {
    raw: '212312, "John"',
    parsed: ['212312', 'John'],
  }
  const testCsv = `${header.raw}\n${body.raw}`

  beforeEach(() => {
    readStream = toReadableStream(testCsv) as NodeJS.ReadStream
  })

  it('should read the stream and call handler for each line', async () => {
    const expectedValues = [body.parsed, header.parsed]
    await processCsv(readStream, async (item: Array<unknown>) => {
      expect(item).toEqual(expectedValues.pop())
    })
  })

  describe('Concurrency', () => {
    const delayMillis = 500
    const prescaler = 100

    it('should process items in sequence', async () => {
      const start = performance.now()
      await processCsv(readStream, async (_item: Array<unknown>) => {
        await new Promise((r) => setTimeout(r, delayMillis))
      })
      const end = performance.now()
      const executionTime = end - start
      expect(Math.floor(executionTime / prescaler)).toEqual((delayMillis * 2) / prescaler)
    })

    it('should process items in parallel', async () => {
      const start = performance.now()
      await processCsv(
        readStream,
        async (_item: Array<unknown>) => {
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
