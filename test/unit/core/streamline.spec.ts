/* eslint-disable @typescript-eslint/no-empty-function */
import toReadableStream from 'to-readable-stream'

import { StreamLine } from '../../../src'
import { TestStreamLine } from '../../utils'

describe('StreamLine', () => {
  let sl: StreamLine
  let readStream: NodeJS.ReadStream

  beforeEach(() => {
    readStream = toReadableStream('hello\nworld') as NodeJS.ReadStream
    sl = new TestStreamLine(readStream)
  })

  describe('Hooks', () => {
    let spyStartHook: jest.SpyInstance
    let spyRun: jest.SpyInstance
    let spyCompleteHook: jest.SpyInstance
    let spyFailedHook: jest.SpyInstance
    let spyEndHook: jest.SpyInstance

    beforeEach(() => {
      spyStartHook = jest.spyOn(TestStreamLine.prototype, 'onStart')
      spyRun = jest.spyOn(TestStreamLine.prototype, 'run')
      spyCompleteHook = jest.spyOn(TestStreamLine.prototype, 'onComplete')
      spyFailedHook = jest.spyOn(TestStreamLine.prototype, 'onFailed')
      spyEndHook = jest.spyOn(TestStreamLine.prototype, 'onEnd')
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should call all hooks', async () => {
      await sl.start()

      expect(spyStartHook).toHaveBeenCalledTimes(1)
      expect(spyRun).toHaveBeenCalledTimes(1)
      expect(spyCompleteHook).toHaveBeenCalledTimes(1)
      expect(spyFailedHook).not.toHaveBeenCalled()
      expect(spyEndHook).toHaveBeenCalledTimes(1)
    })

    it('should call failed hook when run fails', async () => {
      sl.run = () => {
        throw new Error('Failed Hook')
      }

      await sl.start()

      expect(spyStartHook).toHaveBeenCalledTimes(1)
      // expect(spyRun).toHaveBeenCalledTimes(1)
      expect(spyCompleteHook).not.toHaveBeenCalled()
      expect(spyFailedHook).toHaveBeenCalledTimes(1)
      expect(spyEndHook).toHaveBeenCalledTimes(1)
    })
  })

  describe('Processing', () => {
    let spyHandler: jest.SpyInstance
    let spyErrorHandler: jest.SpyInstance
    let spyFailedHook: jest.SpyInstance
    let spyGetInputStream: jest.SpyInstance

    beforeEach(() => {
      spyHandler = jest.spyOn(TestStreamLine.prototype, 'handler')
      spyErrorHandler = jest.spyOn(TestStreamLine.prototype, 'errorHandler')
      spyFailedHook = jest.spyOn(TestStreamLine.prototype, 'onFailed')
      spyGetInputStream = jest.spyOn(TestStreamLine.prototype, 'getInputStream')
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should call the handler n number of times', async () => {
      await sl.start()

      expect(spyGetInputStream).toHaveBeenCalledTimes(1)
      expect(spyHandler).toHaveBeenCalledTimes(2) // for each line in "hello\nworld"
    })

    it('should propagate errors when handler fails', async () => {
      sl.handler = () => {
        throw new Error('Failed Hook')
      }

      await sl.start()

      expect(spyErrorHandler).toHaveBeenCalledTimes(1)
      expect(spyFailedHook).toHaveBeenCalledTimes(1)
    })
  })

  it('should return provided stream', () => {
    expect(sl.getInputStream()).toBe(readStream)
  })
})
