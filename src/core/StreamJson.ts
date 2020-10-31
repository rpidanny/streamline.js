import { StreamLine } from './StreamLine'

export abstract class StreamJson extends StreamLine {
  abstract async processItem(_item: Record<string, unknown>): Promise<void>

  async handler(line: string): Promise<void> {
    const item = await this.parseLine(line)
    await this.processItem(item)
  }

  async parseLine(line: string): Promise<Record<string, unknown>> {
    return JSON.parse(line)
  }
}
