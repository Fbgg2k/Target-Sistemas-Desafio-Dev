const { calcularJuros } = require('../src/modules/juros/juros.service');

describe('calcularJuros', () => {
  test.each([
    ['2026-10-03', 0, 0],
    ['2026-10-04', 0, 0],
    ['2026-10-02', 1, 25],
    ['2026-10-01', 2, 50],
    ['2026-09-23', 10, 250],
  ])('calcula atraso de %s', (vencimento, dias, jurosEsperados) => {
    expect(calcularJuros(1000, vencimento, '2026-10-03')).toEqual({
      diasAtraso: dias,
      juros: jurosEsperados,
      valorTotal: 1000 + jurosEsperados,
    });
  });

  test('rejeita valor zero, negativo ou não numérico', () => {
    expect(() => calcularJuros(0, '2026-10-01', '2026-10-03')).toThrow('Valor inválido.');
    expect(() => calcularJuros(-10, '2026-10-01', '2026-10-03')).toThrow('Valor inválido.');
    expect(() => calcularJuros('100', '2026-10-01', '2026-10-03')).toThrow('Valor inválido.');
  });

  test('rejeita datas inexistentes e formato inválido', () => {
    expect(() => calcularJuros(100, '2026-02-30', '2026-03-01')).toThrow(
      'Data de vencimento inválida.',
    );
    expect(() => calcularJuros(100, '01/10/2026', '2026-10-03')).toThrow(
      'Data de vencimento inválida.',
    );
  });
});
