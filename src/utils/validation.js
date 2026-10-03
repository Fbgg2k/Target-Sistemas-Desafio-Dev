function validarTextoObrigatorio(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label} inválido.`);
  }

  return value.trim();
}

function validarInteiroPositivo(value, label) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${label} deve ser um número inteiro maior que zero.`);
  }

  return value;
}

module.exports = { validarInteiroPositivo, validarTextoObrigatorio };
