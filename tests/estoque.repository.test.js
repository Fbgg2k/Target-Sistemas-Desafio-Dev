const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { criarRepositorioEstoque } = require('../src/modules/estoque/estoque.repository');
const { criarServicoEstoque } = require('../src/modules/estoque/estoque.service');

describe('persistência do estoque', () => {
  test('restaura saldo, histórico e próximo ID após recriar o serviço', () => {
    const diretorioTemporario = fs.mkdtempSync(path.join(os.tmpdir(), 'estoque-'));
    const caminhoEstado = path.join(diretorioTemporario, 'estoque-estado.json');
    const produtosPadrao = [{ codigoProduto: 101, descricaoProduto: 'Caneta Azul', estoque: 10 }];
    const repositorio = criarRepositorioEstoque(caminhoEstado, produtosPadrao);
    const estadoInicial = repositorio.carregar();
    const primeiroServico = criarServicoEstoque(
      estadoInicial.estoque,
      estadoInicial.movimentacoes,
      repositorio.salvar,
    );

    primeiroServico.registrarMovimentacao({
      codigoProduto: 101,
      tipo: 'ENTRADA',
      descricao: 'Reposição',
      quantidade: 5,
    });

    const estadoRestaurado = repositorio.carregar();
    const segundoServico = criarServicoEstoque(
      estadoRestaurado.estoque,
      estadoRestaurado.movimentacoes,
      repositorio.salvar,
    );
    const segundaMovimentacao = segundoServico.registrarMovimentacao({
      codigoProduto: 101,
      tipo: 'SAIDA',
      descricao: 'Venda',
      quantidade: 3,
    });

    expect(estadoRestaurado.estoque[0].estoque).toBe(15);
    expect(estadoRestaurado.movimentacoes).toHaveLength(1);
    expect(segundaMovimentacao).toMatchObject({ id: 2, estoqueAnterior: 15, estoqueAtual: 12 });

    fs.rmSync(diretorioTemporario, { recursive: true, force: true });
  });
});
