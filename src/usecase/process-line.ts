import { StreamLine } from '../core'

export class SimpleLineProcessor extends StreamLine {
  constructor(readStream: NodeJS.ReadStream, public handler: (line: string) => Promise<void>) {
    super(readStream)
  }
}

export const processLine = (
  readStream: NodeJS.ReadStream,
  handler: (line: string) => Promise<void>,
): Promise<void> => {
  const processor = new SimpleLineProcessor(readStream, handler)
  return processor.start()
}
