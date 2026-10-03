const { validarInteiroPositivo, validarTextoObrigatorio } = require('../../utils/validation');

function criarServicoEstoque(produtosIniciais, movimentacoesIniciais = []) {
  if (!Array.isArray(produtosIniciais) || !Array.isArray(movimentacoesIniciais)) {
    throw new Error('Dados de estoque inválidos.');
  }

  const produtos = new Map();
  for (const produto of produtosIniciais) {
    validarInteiroPositivo(produto.codigoProduto, 'Código do produto');
    validarTextoObrigatorio(produto.descricaoProduto, 'Descrição do produto');
    if (!Number.isSafeInteger(produto.estoque) || produto.estoque < 0) {
      throw new Error('Estoque inicial inválido.');
    }
    if (produtos.has(produto.codigoProduto)) {
      throw new Error('Código de produto duplicado.');
    }
    produtos.set(produto.codigoProduto, { ...produto });
  }

  const movimentacoes = movimentacoesIniciais.map((movimentacao) => ({ ...movimentacao }));
  let proximoId =
    movimentacoes.reduce((maiorId, movimentacao) => {
      return Number.isSafeInteger(movimentacao.id) ? Math.max(maiorId, movimentacao.id) : maiorId;
    }, 0) + 1;

  function registrarMovimentacao(movimentacao) {
    const codigoProduto = validarInteiroPositivo(movimentacao?.codigoProduto, 'Código do produto');
    const tipo = validarTextoObrigatorio(movimentacao?.tipo, 'Tipo de movimentação').toUpperCase();
    const descricao = validarTextoObrigatorio(movimentacao?.descricao, 'Descrição');
    const quantidade = validarInteiroPositivo(movimentacao?.quantidade, 'Quantidade');
    const produto = produtos.get(codigoProduto);

    if (!produto) {
      throw new Error('Produto não encontrado.');
    }
    if (tipo !== 'ENTRADA' && tipo !== 'SAIDA') {
      throw new Error('Tipo de movimentação inválido. Use ENTRADA ou SAIDA.');
    }

    const estoqueAnterior = produto.estoque;
    const estoqueAtual =
      tipo === 'ENTRADA' ? estoqueAnterior + quantidade : estoqueAnterior - quantidade;
    if (estoqueAtual < 0) {
      throw new Error('Estoque insuficiente.');
    }

    const registro = {
      id: proximoId,
      codigoProduto,
      tipo,
      descricao,
      quantidade,
      estoqueAnterior,
      estoqueAtual,
    };

    produto.estoque = estoqueAtual;
    movimentacoes.push(registro);
    proximoId += 1;

    return { ...registro, quantidadeMovimentada: registro.quantidade };
  }

  function listarEstoque() {
    return Array.from(produtos.values(), (produto) => ({ ...produto }));
  }

  function listarMovimentacoes() {
    return movimentacoes.map((movimentacao) => ({ ...movimentacao }));
  }

  return { listarEstoque, listarMovimentacoes, registrarMovimentacao };
}

module.exports = { criarServicoEstoque };
