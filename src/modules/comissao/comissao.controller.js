const { calcularComissoes } = require('./comissao.service');
const { formatCurrency } = require('../../utils/currency');

function exibirComissoes(vendas, escrever = console.log) {
  const resultados = calcularComissoes(vendas);

  for (const resultado of resultados) {
    escrever(`\n${resultado.vendedor}`);
    escrever(`Total vendido: ${formatCurrency(resultado.totalVendas)}`);
    escrever(`Comissão: ${formatCurrency(resultado.totalComissao)}`);
  }

  return resultados;
}

module.exports = { exibirComissoes };
