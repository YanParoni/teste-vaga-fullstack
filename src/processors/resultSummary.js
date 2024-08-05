function resultSummary(clientesProdutos, totalContratos, startTime, results, maiorContrato) {
  let clienteComMaisProdutos = ''
  let maxProdutos = 0

  for (const cliente in clientesProdutos) {
    if (clientesProdutos[cliente] > maxProdutos) {
      maxProdutos = clientesProdutos[cliente]
      clienteComMaisProdutos = cliente
    }
  }

  const endTime = Date.now()
  const duration = endTime - startTime

  return {
    duration,
    totalContratos,
    clienteComMaisProdutos,
    maxProdutos,
    maiorContrato,
    results
  }
}

module.exports = {
  resultSummary
}
