import { Streamline } from './'

export class SimpleLineProcessor extends Streamline {
  constructor(readStream: NodeJS.ReadableStream, public handler: (line: string) => Promise<void>) {
    super(readStream)
  }
}

export const processLine = (
  readStream: NodeJS.ReadableStream,
  handler: (line: string) => Promise<void>,
  concurrency = 1,
): Promise<void> => {
  const processor = new SimpleLineProcessor(readStream, handler)
  return processor.start(concurrency)
}
