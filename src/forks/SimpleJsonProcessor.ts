import { StreamlineJson } from '../core'

export class SimpleJsonProcessor extends StreamlineJson {
  constructor(
    readStream: NodeJS.ReadStream,
    public processItem: (item: Record<string, unknown>) => Promise<void>,
  ) {
    super(readStream)
  }
}

export const processJson = (
  readStream: NodeJS.ReadStream,
  handler: (item: Record<string, unknown>) => Promise<void>,
  concurrency = 1,
): Promise<void> => {
  const processor = new SimpleJsonProcessor(readStream, handler)
  return processor.start(concurrency)
}
