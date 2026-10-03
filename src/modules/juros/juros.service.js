const { fromCents, toCents } = require('../../utils/currency');
const { calcularDiasAtraso } = require('../../utils/date');

function calcularJuros(valor, dataVencimento, dataAtual = new Date()) {
  const valorEmCentavos = toCents(valor, 'Valor', false);
  const diasAtraso = calcularDiasAtraso(dataVencimento, dataAtual);
  const jurosEmCentavos = Math.round((valorEmCentavos * 25 * diasAtraso) / 1000);

  return {
    diasAtraso,
    juros: fromCents(jurosEmCentavos),
    valorTotal: fromCents(valorEmCentavos + jurosEmCentavos),
  };
}

module.exports = { calcularJuros };
