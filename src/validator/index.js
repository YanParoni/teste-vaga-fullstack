function identificarCpfCnpj(valor) {
  const somenteNumeros = valor.replace(/\D/g, '')
  if (somenteNumeros.length === 11) {
    return 'CPF'
  } else if (somenteNumeros.length === 14) {
    return 'CNPJ'
  } else {
    return 'INVALIDO'
  }
}

function processarCpfCnpj(valor) {
  let somenteNumeros = ''
  let primeiroCaractere = valor[0]
  let sequenciaRepetida = true

  for (let i = 0; i < valor.length; i++) {
    if (!isNaN(valor[i]) && valor[i] !== ' ') {
      if (valor[i] !== primeiroCaractere) {
        sequenciaRepetida = false
      }
      somenteNumeros += valor[i]
    }
  }

  return { somenteNumeros, sequenciaRepetida }
}

// regras de validação de cpf podem ser vistas aqui https://www.somatematica.com.br/faq/cpf.php
function validarCPF(cpf) {
  const { somenteNumeros, sequenciaRepetida } = processarCpfCnpj(cpf)

  // verifica se todos os caracteres são iguais
  if (sequenciaRepetida) return false

  // primeira verificação calcular o primeiro dígito verificador
  let somaPrimeiroDigito = 0
  for (let i = 0; i < 9; i++) {
    somaPrimeiroDigito += parseInt(somenteNumeros.charAt(i)) * (10 - i)
  }

  let restoPrimeiroDigito = 11 - (somaPrimeiroDigito % 11)
  let primeiroDigitoVerificador = restoPrimeiroDigito > 9 ? 0 : restoPrimeiroDigito
  if (parseInt(somenteNumeros.charAt(9)) !== primeiroDigitoVerificador) return false

  // segunda verificação calcular o segundo dígito verificador
  let somaSegundoDigito = 0
  for (let i = 0; i < 10; i++) {
    somaSegundoDigito += parseInt(somenteNumeros.charAt(i)) * (11 - i)
  }

  let restoSegundoDigito = 11 - (somaSegundoDigito % 11)
  let segundoDigitoVerificador = restoSegundoDigito > 9 ? 0 : restoSegundoDigito
  return parseInt(somenteNumeros.charAt(10)) === segundoDigitoVerificador
}


// regras de validaçao cnpj podem ser vistas aqui https://www.macoratti.net/alg_cnpj.htm

function validarCNPJ(cnpj) {
  const { somenteNumeros, sequenciaRepetida } = processarCpfCnpj(cnpj)

  // verifica se todos os caracteres são iguais
  if (sequenciaRepetida) return false

  // validação do primeiro digito verificador
  let tamanhoBase = somenteNumeros.length - 2
  let baseNumerica = somenteNumeros.substring(0, tamanhoBase)
  let digitosVerificadores = somenteNumeros.substring(tamanhoBase)
  let somaPrimeiroDigito = 0
  let posicaoMultiplicador = tamanhoBase - 7

  for (let i = tamanhoBase; i >= 1; i--) {
    somaPrimeiroDigito += baseNumerica.charAt(tamanhoBase - i) * posicaoMultiplicador--
    if (posicaoMultiplicador < 2) posicaoMultiplicador = 9
  }

  let primeiroResultado = somaPrimeiroDigito % 11 < 2 ? 0 : 11 - (somaPrimeiroDigito % 11)
  if (primeiroResultado != digitosVerificadores.charAt(0)) return false

  // validação do segundo dígito verificador
  tamanhoBase += 1
  baseNumerica = somenteNumeros.substring(0, tamanhoBase)
  let somaSegundoDigito = 0
  posicaoMultiplicador = tamanhoBase - 7

  for (let i = tamanhoBase; i >= 1; i--) {
    somaSegundoDigito += baseNumerica.charAt(tamanhoBase - i) * posicaoMultiplicador--
    if (posicaoMultiplicador < 2) posicaoMultiplicador = 9
  }

  let segundoResultado = somaSegundoDigito % 11 < 2 ? 0 : 11 - (somaSegundoDigito % 11)
  return segundoResultado == digitosVerificadores.charAt(1)
}

function validateData(row) {
  const tipoDocumento = identificarCpfCnpj(row.nrCpfCnpj);
  let isValidDocument;
  if (tipoDocumento === 'CPF') {
    isValidDocument = validarCPF(row.nrCpfCnpj);
  } else if (tipoDocumento === 'CNPJ') {
    isValidDocument = validarCNPJ(row.nrCpfCnpj);
  } else {
    isValidDocument = false;
  }
  return { ...row, isValidDocument };
}


module.exports = { validarCPF, validarCNPJ, identificarCpfCnpj, processarCpfCnpj, validateData };
