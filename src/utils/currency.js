const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function toCents(value, label = 'Valor', allowZero = true) {
  if (!Number.isFinite(value) || value < 0 || (!allowZero && value === 0)) {
    throw new Error(`${label} inválido.`);
  }

  return Math.round((value + Number.EPSILON) * 100);
}

function fromCents(cents) {
  return cents / 100;
}

function formatCurrency(value) {
  return currencyFormatter.format(value);
}

module.exports = { formatCurrency, fromCents, toCents };
