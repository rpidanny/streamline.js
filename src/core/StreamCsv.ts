import { CsvError } from 'csv-parse'
import csvParse from 'csv-parse/lib/sync'

import { StreamLine } from './StreamLine'
import { CsvParsingError } from './errors'

export class StreamCsv extends StreamLine {
  private parsingOptions = { quote: '"', ltrim: true, rtrim: true, delimiter: ',' }

  async handler(line: string): Promise<void> {
    const item = await this.parseLine(line)
    await this.processItem(item)
  }

  async parseLine(line: string): Promise<Array<any>> {
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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async processItem(_item: Array<any>): Promise<void> {}
}
