import { StreamlineCsv } from './'

export class SimpleCsvProcessor extends StreamlineCsv {
  constructor(
    readStream: NodeJS.ReadableStream,
    public processItem: (item: Array<unknown>) => Promise<void>,
  ) {
    super(readStream)
  }
}

export const processCsv = (
  readStream: NodeJS.ReadableStream,
  handler: (item: Array<unknown>) => Promise<void>,
  concurrency = 1,
): Promise<void> => {
  const processor = new SimpleCsvProcessor(readStream, handler)
  return processor.start(concurrency)
}
