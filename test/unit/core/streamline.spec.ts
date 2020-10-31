/* eslint-disable @typescript-eslint/no-empty-function */
import toReadableStream from 'to-readable-stream'

import { Streamline } from '../../../src'
import { TestStreamline } from '../../utils'

describe('Streamline', () => {
  let sl: Streamline
  let readStream: NodeJS.ReadStream

  beforeEach(() => {
    readStream = toReadableStream('hello\nworld') as NodeJS.ReadStream
    sl = new TestStreamline(readStream)
  })

  describe('Hooks', () => {
    let spyStartHook: jest.SpyInstance
    let spyRun: jest.SpyInstance
    let spyCompleteHook: jest.SpyInstance
    let spyFailedHook: jest.SpyInstance
    let spyEndHook: jest.SpyInstance

    beforeEach(() => {
      spyStartHook = jest.spyOn(TestStreamline.prototype, 'onStart')
      spyRun = jest.spyOn(TestStreamline.prototype, 'run')
      spyCompleteHook = jest.spyOn(TestStreamline.prototype, 'onComplete')
      spyFailedHook = jest.spyOn(TestStreamline.prototype, 'onFailed')
      spyEndHook = jest.spyOn(TestStreamline.prototype, 'onEnd')
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
      spyHandler = jest.spyOn(TestStreamline.prototype, 'handler')
      spyErrorHandler = jest.spyOn(TestStreamline.prototype, 'errorHandler')
      spyFailedHook = jest.spyOn(TestStreamline.prototype, 'onFailed')
      spyGetInputStream = jest.spyOn(TestStreamline.prototype, 'getInputStream')
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
