const { parentPort, workerData, isMainThread } = require('worker_threads')
const { validateData } = require('../validator')
const { formatData } = require('../formatter')

function workerProcess(batch) {
  const processedBatch = batch.map(row => {
    const validatedRow = validateData(row)
    return formatData(validatedRow)
  })

  if (parentPort) {
    parentPort.postMessage(processedBatch)
  } else {
    console.log(processedBatch)
  }
}

if (!isMainThread) {
  workerProcess(workerData)
}

module.exports = {
  workerProcess
}
