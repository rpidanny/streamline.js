import { CsvError } from 'csv-parse'
import csvParse from 'csv-parse/lib/sync'

import { StreamLine } from './StreamLine'
import { CsvParsingError } from './errors'

export abstract class StreamCsv extends StreamLine {
  abstract async processItem(_item: Array<unknown>): Promise<void>

  private parsingOptions = { quote: '"', ltrim: true, rtrim: true, delimiter: ',' }

  async handler(line: string): Promise<void> {
    const item = await this.parseLine(line)
    await this.processItem(item)
  }

  async parseLine(line: string): Promise<Array<unknown>> {
    try {
      const [item] = csvParse(line, this.parsingOptions)

      if (!item) {
        throw new CsvParsingError(`Failed to parse line: ${line}`)
      }

      return item
    } catch (err) {
      if (err instanceof CsvError) {
        throw new CsvParsingError(err.message)
      }
      throw err
    }
  }
}
