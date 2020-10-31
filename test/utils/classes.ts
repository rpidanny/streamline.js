/* eslint-disable @typescript-eslint/no-empty-function */
import { Streamline, StreamlineJson, StreamlineCsv } from '../../src'

export class TestStreamline extends Streamline {
  async handler(): Promise<void> {}
}

export class TestStreamlineCsv extends StreamlineCsv {
  async processItem(): Promise<void> {}
}

export class TestStreamlineJson extends StreamlineJson {
  async processItem(): Promise<void> {}
}
