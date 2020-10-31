import { StreamlineCsv } from '../core'

export class SimpleCsvProcessor extends StreamlineCsv {
  constructor(
    readStream: NodeJS.ReadStream,
    public processItem: (item: Array<unknown>) => Promise<void>,
  ) {
    super(readStream)
  }
}

export const processCsv = (
  readStream: NodeJS.ReadStream,
  handler: (item: Array<unknown>) => Promise<void>,
  concurrency = 1,
): Promise<void> => {
  const processor = new SimpleCsvProcessor(readStream, handler)
  return processor.start(concurrency)
}
