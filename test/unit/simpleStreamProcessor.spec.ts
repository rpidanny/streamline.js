import stream from 'stream'

import { SimpleStreamProcessor } from '../../src/streamline'

describe('SimpleStreamProcessor', () => {
  let readStream!: NodeJS.ReadableStream
  let ssp!: SimpleStreamProcessor
  beforeAll(() => {
    readStream = new stream.Readable()
    ssp = new SimpleStreamProcessor(readStream)
  })

  it('should return provided stream', () => {
    expect(ssp.getInputStream()).toBe(readStream)
  })
})
