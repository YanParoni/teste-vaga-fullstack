
function formatToBRL(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatData(row) {
  const formattedTotal = formatToBRL(row.vlTotal)
  const formattedPresta = formatToBRL(row.vlPresta)
  return { ...row, formattedTotal, formattedPresta }
}

module.exports = {
  formatData
}
