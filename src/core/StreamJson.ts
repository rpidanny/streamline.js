import { StreamLine } from './StreamLine'

export class StreamJson extends StreamLine {
  async handler(line: string): Promise<void> {
    const item = await this.parseLine(line)
    await this.processItem(item)
  }

  async parseLine(line: string): Promise<Record<string, unknown>> {
    return JSON.parse(line)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async processItem(_item: Record<string, unknown>): Promise<void> {}
}