const { fromCents, toCents } = require('../../utils/currency');
const { validarTextoObrigatorio } = require('../../utils/validation');

function calcularComissao(valor) {
  const valorEmCentavos = toCents(valor, 'Valor da venda');
  const taxaEmPontosBase = valorEmCentavos < 10000 ? 0 : valorEmCentavos < 50000 ? 100 : 500;
  const comissaoEmCentavos = Math.round((valorEmCentavos * taxaEmPontosBase) / 10000);

  return fromCents(comissaoEmCentavos);
}

function calcularComissoes(vendas) {
  if (!Array.isArray(vendas)) {
    throw new Error('A lista de vendas é inválida.');
  }

  const totaisPorVendedor = new Map();

  for (const venda of vendas) {
    const vendedor = validarTextoObrigatorio(venda?.vendedor, 'Vendedor');
    const valorEmCentavos = toCents(venda.valor, 'Valor da venda');
    const comissaoEmCentavos = Math.round(
      (valorEmCentavos * (valorEmCentavos < 10000 ? 0 : valorEmCentavos < 50000 ? 100 : 500)) /
        10000,
    );
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
