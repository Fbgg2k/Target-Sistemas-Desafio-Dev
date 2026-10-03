const fs = require('node:fs');
const path = require('node:path');

function criarRepositorioEstoque(caminhoEstado, estoquePadrao) {
  function carregar() {
    if (!fs.existsSync(caminhoEstado)) {
      return {
        estoque: estoquePadrao.map((produto) => ({ ...produto })),
        movimentacoes: [],
      };
    }

    const estado = JSON.parse(fs.readFileSync(caminhoEstado, 'utf8'));
    if (!Array.isArray(estado.estoque) || !Array.isArray(estado.movimentacoes)) {
      throw new Error('Estado persistido do estoque inválido.');
    }

    return estado;
  }

  function salvar(estado) {
    const caminhoTemporario = `${caminhoEstado}.${process.pid}.tmp`;
    fs.mkdirSync(path.dirname(caminhoEstado), { recursive: true });

    try {
      fs.writeFileSync(caminhoTemporario, `${JSON.stringify(estado, null, 2)}\n`, 'utf8');
      fs.renameSync(caminhoTemporario, caminhoEstado);
    } catch (error) {
      fs.rmSync(caminhoTemporario, { force: true });
      throw error;
    }
  }

  return { carregar, salvar };
}

module.exports = { criarRepositorioEstoque };
