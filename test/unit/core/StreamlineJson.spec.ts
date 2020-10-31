import stream from 'stream'

import { StreamlineJson } from '../../../src'
import { TestStreamlineJson } from '../../utils'

describe('StreamlineJson', () => {
  let readStream!: NodeJS.ReadableStream
  let sjp!: StreamlineJson

  const parsedData = {
    id: 123412,
    name: 'John',
  }
  const rawData = JSON.stringify(parsedData)

  beforeAll(() => {
    readStream = new stream.Readable()
    sjp = new TestStreamlineJson(readStream)
  })

  it('should return parsed json ', async () => {
    expect(await sjp.parseLine(rawData)).toEqual(parsedData)
  })

  it('should call processItem with parsed item', async () => {
    const spyProcessItem = jest.spyOn(TestStreamlineJson.prototype, 'processItem')

    await sjp.handler(rawData)

    expect(spyProcessItem).toHaveBeenCalledTimes(1)
    expect(spyProcessItem).toHaveBeenCalledWith(parsedData)
  })

  describe('Failure', () => {
    ;['', '"id", "name"'].forEach((input) => {
      it(`should throw SyntaxError when input is ${input}`, async () => {
        expect.assertions(2)
        try {
          await sjp.parseLine(input)
        } catch (err) {
          expect(err).toBeInstanceOf(Error)
          expect(err).toHaveProperty('name', 'SyntaxError')
        }
      })
    })

    it('should propagate errors to handler', async () => {
      expect.assertions(2)
      try {
        await sjp.handler('')
      } catch (err) {
        expect(err).toBeInstanceOf(Error)
        expect(err).toHaveProperty('name', 'SyntaxError')
      }
    })
  })
})
