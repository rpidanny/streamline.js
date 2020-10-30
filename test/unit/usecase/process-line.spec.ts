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
})
