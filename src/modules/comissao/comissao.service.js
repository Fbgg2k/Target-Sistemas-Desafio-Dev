const { fromCents, toCents } = require('../../utils/currency');
const { validarTextoObrigatorio } = require('../../utils/validation');

function calcularComissaoEmCentavos(valorEmCentavos) {
  const taxaEmPontosBase = valorEmCentavos < 10000 ? 0 : valorEmCentavos < 50000 ? 100 : 500;
  return Math.round((valorEmCentavos * taxaEmPontosBase) / 10000);
}

function calcularComissao(valor) {
  const valorEmCentavos = toCents(valor, 'Valor da venda');

  return fromCents(calcularComissaoEmCentavos(valorEmCentavos));
}

function calcularComissoes(vendas) {
  if (!Array.isArray(vendas)) {
    throw new Error('A lista de vendas é inválida.');
  }

  const totaisPorVendedor = new Map();

  for (const venda of vendas) {
    const vendedor = validarTextoObrigatorio(venda?.vendedor, 'Vendedor');
    const valorEmCentavos = toCents(venda.valor, 'Valor da venda');
    const comissaoEmCentavos = calcularComissaoEmCentavos(valorEmCentavos);
    const totais = totaisPorVendedor.get(vendedor) ?? { totalVendas: 0, totalComissao: 0 };

    totais.totalVendas += valorEmCentavos;
    totais.totalComissao += comissaoEmCentavos;
    totaisPorVendedor.set(vendedor, totais);
  }

  return Array.from(totaisPorVendedor, ([vendedor, totais]) => ({
    vendedor,
    totalVendas: fromCents(totais.totalVendas),
    totalComissao: fromCents(totais.totalComissao),
  }));
}

module.exports = { calcularComissao, calcularComissoes };
