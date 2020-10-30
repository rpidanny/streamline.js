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
})
