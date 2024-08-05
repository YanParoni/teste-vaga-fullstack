function processRow(row, clientesProdutos, maiorContrato) {
  if (!clientesProdutos[row.nmClient]) {
    clientesProdutos[row.nmClient] = 0;
  }
  clientesProdutos[row.nmClient]++;

  const valorTotal = parseFloat(row.vlTotal.replace(',', '.'));
  if (valorTotal > maiorContrato.valor) {
    maiorContrato.valor = valorTotal;
    maiorContrato.contrato = row.nrContrato;
  }
}

module.exports = {
  processRow
};
