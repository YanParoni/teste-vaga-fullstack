const { createReadStream, createProcessStream } = require('./processors/csvProcessor')
const { processRow } = require('./processors/rowProcessor')
const { resultSummary } = require('./processors/resultSummary')
const { isMainThread } = require('worker_threads')

const util = require('util')

if (isMainThread) {
  const results = []
  const clientesProdutos = {}
  let maiorContrato = { valor: 0, contrato: null }
  let totalContratos = 0

  const startTime = Date.now()

  const readStream = createReadStream('data/data.csv')
  const processStream = createProcessStream(results)

  readStream.pipe(processStream)

  processStream.on('data', (data) => {
    data.forEach(row => {
      processRow(row, clientesProdutos, maiorContrato)
      totalContratos++
    })
  })

  processStream.on('end', () => {
    const summary = resultSummary(clientesProdutos, totalContratos, startTime, results, maiorContrato)

    console.log(util.inspect(summary.results, { maxArrayLength: null, depth: null }))
    console.log(`Tempo total de execução: ${summary.duration} ms`)
    console.log(`Total de contratos lidos: ${summary.totalContratos}`)
    console.log(`Cliente com mais produtos financeiros emitidos: ${summary.clienteComMaisProdutos} (${summary.maxProdutos} produtos)`)
    console.log(`Contrato com maior valor: ${summary.maiorContrato.contrato} (R$ ${summary.maiorContrato.valor.toFixed(2)})`)
  })
}
