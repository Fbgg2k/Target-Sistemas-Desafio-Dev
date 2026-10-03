const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function toDayNumber(value, label) {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new Error(`${label} inválida.`);
    }

    return Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()) / MILLISECONDS_PER_DAY;
  }

  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${label} inválida.`);
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`${label} inválida.`);
  }

  return date.getTime() / MILLISECONDS_PER_DAY;
}

function calcularDiasAtraso(dataVencimento, dataAtual = new Date()) {
  const vencimento = toDayNumber(dataVencimento, 'Data de vencimento');
  const hoje = toDayNumber(dataAtual, 'Data atual');

  return Math.max(0, hoje - vencimento);
}

module.exports = { calcularDiasAtraso };
