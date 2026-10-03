function exibirMovimentacao(servicoEstoque, movimentacao, escrever = console.log) {
  const resultado = servicoEstoque.registrarMovimentacao(movimentacao);

  escrever(`Movimentação #${resultado.id} registrada.`);
  escrever(`Produto: ${resultado.codigoProduto}`);
  escrever(`Tipo: ${resultado.tipo}`);
  escrever(`Descrição: ${resultado.descricao}`);
  escrever(`Quantidade movimentada: ${resultado.quantidadeMovimentada}`);
  escrever(`Estoque anterior: ${resultado.estoqueAnterior}`);
  escrever(`Estoque atual: ${resultado.estoqueAtual}`);

  return resultado;
}

module.exports = { exibirMovimentacao };
