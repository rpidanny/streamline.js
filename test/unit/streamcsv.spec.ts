import stream from 'stream'

import { StreamCsv } from '../../src'

describe('StreamCsv', () => {
  let readStream!: NodeJS.ReadableStream
  let scp!: StreamCsv

  const header = {
    raw: '"id", "name"',
    parsed: ['id', 'name'],
  }
  const body = {
    raw: '212312, "John"',
    parsed: ['212312', 'John'],
  }
  const testCsv = {
    raw: `${header.raw}\n${body.raw}`,
    parsed: [header.parsed, body.parsed],
  }

  beforeAll(() => {
    readStream = new stream.Readable()
    scp = new StreamCsv(readStream)
  })

  it('should return parsed csv as am array', async () => {
    expect(await scp.parseLine(header.raw)).toEqual(header.parsed)
    expect(await scp.parseLine(body.raw)).toEqual(body.parsed)
  })

  it('should only return parsed first line when multiple lines are provided', async () => {
    expect(await scp.parseLine(testCsv.raw)).toEqual(header.parsed)
  })

  it('should call processItem with parsed item', async () => {
    const spyProcessItem = jest.spyOn(StreamCsv.prototype, 'processItem')

    await scp.handler(body.raw)

    expect(spyProcessItem).toHaveBeenCalledTimes(1)
    expect(spyProcessItem).toHaveBeenCalledWith(body.parsed)
  })

  describe('Failure', () => {
    it('should throw CsvParsingError when empty string', async () => {
      expect.assertions(3)
      const input = ''
      try {
        await scp.parseLine(input)
      } catch (err) {
        expect(err).toBeInstanceOf(Error)
        expect(err).toHaveProperty('name', 'CsvParsingError')
        expect(err.toString()).toBe(`CsvParsingError: Failed to parse line: ${input}`)
      }
    })

    it('should throw CsvParsingError when json string', async () => {
      expect.assertions(2)
      const input = JSON.stringify({ name: 'John', lastName: 'Doe' })
      try {
        await scp.parseLine(input)
      } catch (err) {
        expect(err).toBeInstanceOf(Error)
        expect(err).toHaveProperty('name', 'CsvParsingError')
      }
    })
  })
})
