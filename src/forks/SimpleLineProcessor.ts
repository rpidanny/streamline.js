import { Streamline } from '../core'

export class SimpleLineProcessor extends Streamline {
  constructor(readStream: NodeJS.ReadStream, public handler: (line: string) => Promise<void>) {
    super(readStream)
  }
}

export const processLine = (
  readStream: NodeJS.ReadStream,
  handler: (line: string) => Promise<void>,
  concurrency = 1,
): Promise<void> => {
  const processor = new SimpleLineProcessor(readStream, handler)
  return processor.start(concurrency)
}
