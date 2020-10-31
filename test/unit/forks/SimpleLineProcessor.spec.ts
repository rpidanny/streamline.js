import { performance } from 'perf_hooks'
import toReadableStream from 'to-readable-stream'

import { processLine } from '../../../src'

describe('Process Line', () => {
  let readStream: NodeJS.ReadStream

  beforeEach(() => {
    readStream = toReadableStream('hello\nworld') as NodeJS.ReadStream
  })

  it('should read the stream and call handler for each line', async () => {
    const expectedValues = ['world', 'hello']
    await processLine(readStream, async (line: string) => {
      expect(line).toEqual(expectedValues.pop())
    })
  })

  describe('Concurrency', () => {
    const delayMillis = 500
    const prescaler = 100

    it('should process items in sequence', async () => {
      const start = performance.now()
      await processLine(readStream, async (_line: string) => {
        await new Promise((r) => setTimeout(r, delayMillis))
      })
      const end = performance.now()
      const executionTime = end - start
      expect(Math.floor(executionTime / prescaler)).toEqual((delayMillis * 2) / prescaler)
    })

    it('should process items in parallel', async () => {
      const start = performance.now()
      await processLine(
        readStream,
        async (_line: string) => {
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
