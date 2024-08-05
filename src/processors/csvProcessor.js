const fs = require('fs')
const csv = require('csv-parser')
const { Transform } = require('stream')
const { Worker } = require('worker_threads')

const batchSize = 10000 // processa 10.000 linhas por vez

function createReadStream(filePath) {
  return fs.createReadStream(filePath).pipe(csv())
}

function createProcessStream(results) {
  return new Transform({
    objectMode: true,
    highWaterMark: batchSize,
    transform(chunk, encoding, callback) {
      results.push(chunk)
      if (results.length >= batchSize) {
        const batch = results.splice(0, batchSize)
        processBatch(batch, callback)
      } else {
        callback()
      }
    },
    flush(callback) {
      if (results.length > 0) {
        processBatch(results, callback)
      } else {
        callback()
      }
    }
  })
}

function processBatch(batch, callback) {
  const worker = new Worker('./src/workers/index.js', {
    workerData: batch
  })
  worker.on('message', (processedBatch) => {
    callback(null, processedBatch)
  })
  worker.on('error', (error) => {
    console.error('Worker error:', error)
    callback(error)
  })
}

module.exports = {
  createReadStream,
  createProcessStream
}
