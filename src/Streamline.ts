import _ from 'highland'

export abstract class Streamline {
  abstract handler(_line: string): Promise<void>

  constructor(private readStream: NodeJS.ReadableStream) {}

  getInputStream(): NodeJS.ReadableStream {
    return this.readStream
  }
  errorHandler(err: Error, push: (err: Error) => void): void {
    return push(err)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onStart(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onComplete(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onEnd(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onFailed(_err: Error): void {}

  async run(concurrency: number): Promise<unknown> {
    const highlandStream: Highland.Stream<string> = _(this.getInputStream())
    return highlandStream
      .split()
      .compact()
      .map((line) => _(this.handler(line)))
      .parallel(concurrency)
      .errors(this.errorHandler)
      .compact()
      .toPromise(Promise)
  }

  async start(concurrency = 1): Promise<void> {
    try {
      await this.onStart()
      await this.run(concurrency)
      await this.onComplete()
    } catch (err) {
      await this.onFailed(err)
    } finally {
      await this.onEnd()
    }
  }
}
