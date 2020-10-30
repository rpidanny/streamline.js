import toReadableStream from 'to-readable-stream'

import { processJson } from '../../../src'

describe('Process JSON', () => {
  let readStream: NodeJS.ReadStream
  const testData1 = { id: 0, name: 'Annapurna' }
  const testData2 = { id: 1, name: 'Machapuchare' }

  beforeEach(() => {
    readStream = toReadableStream(
      `${JSON.stringify(testData1)}\n${JSON.stringify(testData2)}`,
    ) as NodeJS.ReadStream
  })

  it('should read the stream and call handler for each line', async () => {
    const expectedValues = [testData2, testData1]
    await processJson(readStream, async (item: Record<string, unknown>) => {
      expect(item).toEqual(expectedValues.pop())
    })
  })
})
