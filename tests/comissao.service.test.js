const { calcularComissao, calcularComissoes } = require('../src/modules/comissao/comissao.service');

describe('calcularComissao', () => {
  test.each([
    [99.99, 0],
    [100, 1],
    [499.99, 5],
    [500, 25],
    [1000, 50],
  ])('calcula a comissão de %s como %s', (valor, esperado) => {
    expect(calcularComissao(valor)).toBe(esperado);
  });

  test.each([NaN, Infinity, -1, '100', undefined])('rejeita valor inválido: %s', (valor) => {
    expect(() => calcularComissao(valor)).toThrow('Valor da venda inválido.');
  });
});

describe('calcularComissoes', () => {
  test('agrupa vendas e arredonda a comissão de cada venda', () => {
    expect(
      calcularComissoes([
        { vendedor: 'Ana', valor: 100 },
        { vendedor: 'Ana', valor: 499.99 },
        { vendedor: 'Bia', valor: 90 },
        { vendedor: 'Caio', valor: 500 },
      ]),
    ).toEqual([
      { vendedor: 'Ana', totalVendas: 599.99, totalComissao: 6 },
      { vendedor: 'Bia', totalVendas: 90, totalComissao: 0 },
      { vendedor: 'Caio', totalVendas: 500, totalComissao: 25 },
    ]);
  });

  test('rejeita vendedor vazio ou lista inválida', () => {
    expect(() => calcularComissoes([{ vendedor: ' ', valor: 10 }])).toThrow('Vendedor inválido.');
    expect(() => calcularComissoes(null)).toThrow('A lista de vendas é inválida.');
  });
});
