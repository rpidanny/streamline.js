import toReadableStream from 'to-readable-stream'

import { Streamline } from '../../src/streamline'

export class TestStreamline extends Streamline {
  getInputStream(): NodeJS.ReadableStream {
    return toReadableStream('hello\nworld')
  }
}
