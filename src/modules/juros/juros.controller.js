const { calcularJuros } = require('./juros.service');
const { formatCurrency } = require('../../utils/currency');

function exibirCalculoJuros(valor, dataVencimento, dataAtual, escrever = console.log) {
  const resultado = calcularJuros(valor, dataVencimento, dataAtual);

  escrever(`Dias em atraso: ${resultado.diasAtraso}`);
  escrever(`Juros: ${formatCurrency(resultado.juros)}`);
  escrever(`Valor atualizado: ${formatCurrency(resultado.valorTotal)}`);

  return resultado;
}

module.exports = { exibirCalculoJuros };
