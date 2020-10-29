import { Streamline } from '.'

export class SimpleStreamProcessor extends Streamline {
  constructor(private readStream: NodeJS.ReadableStream) {
    super()
  }

  getInputStream(): NodeJS.ReadableStream {
    return this.readStream
  }
}
