# streamline.js

A JavaScript package that helps to reads and processes a stream line-by-line in order or in batches in parallel.

## Install

```sh
$ npm install --save @rpidanny/streamline.js
```

## Usage

### Functions

#### processLine(readStream, handler, concurrency)

| Parameters    | Default | Description                                                                                    |
| ------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `readStream`  | `None`  | Any Node.js `ReadStream` object                                                                |
| `handler`     | `None`  | A processing function that is called on every line of the stream with the line as the argument |
| `concurrency` | `1`     | The number of concurrent execution of the handler                                              |

#### processJson(readStream, handler, concurrency)

| Parameters    | Default | Description                                                                                                    |
| ------------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| `readStream`  | `None`  | Any Node.js `ReadStream` object                                                                                |
| `handler`     | `None`  | A processing function that is called on every line of the stream with the parsed `JSON` object as the argument |
| `concurrency` | `1`     | The number of concurrent execution of the handler                                                              |

#### processCsv(readStream, handler, concurrency)

| Parameters    | Default | Description                                                                                          |
| ------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `readStream`  | `None`  | Any Node.js `ReadStream` object                                                                      |
| `handler`     | `None`  | A processing function that is called on every line of the stream with the parsed CSV as the argument |
| `concurrency` | `1`     | The number of concurrent execution of the handler                                                    |

#### Example

```js
const readStream = fs.createReadStream(`jsonlFile.json`)
await processJson(
  readStream,
  async (item: Record<string, unknown>) => {
    console.log(item)
  },
  2,
)
```

### Classes

#### Base classes

* `Streamline`
* `StreamlineCsv`
* `StreamlineJson`

These are abstract classes that can be inherited to create complex classes to process read streams.

#### Forked classes

These classes are derived from `Base classes` which is suitable for some common use cases.

* `SimpleCsvProcessor`
* `SimpleJsonProcessor`
* `SimpleCsvProcessor`
