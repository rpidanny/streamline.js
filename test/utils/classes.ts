/* eslint-disable @typescript-eslint/no-empty-function */
import { StreamLine, StreamJson, StreamCsv } from '../../src'

export class TestStreamLine extends StreamLine {
  async handler(): Promise<void> {}
}

export class TestStreamCsv extends StreamCsv {
  async processItem(): Promise<void> {}
}

export class TestStreamJson extends StreamJson {
  async processItem(): Promise<void> {}
}
