const { criarServicoEstoque } = require('../src/modules/estoque/estoque.service');

const produtos = [{ codigoProduto: 101, descricaoProduto: 'Caneta Azul', estoque: 10 }];

describe('criarServicoEstoque', () => {
  test('registra entradas e saídas com identificadores únicos', () => {
    const servico = criarServicoEstoque(produtos);
    const entrada = servico.registrarMovimentacao({
      codigoProduto: 101,
      tipo: 'ENTRADA',
      descricao: 'Reposição',
      quantidade: 5,
    });
    const saida = servico.registrarMovimentacao({
      codigoProduto: 101,
      tipo: 'SAIDA',
      descricao: 'Venda',
      quantidade: 3,
    });

    expect(entrada).toMatchObject({ id: 1, estoqueAnterior: 10, estoqueAtual: 15 });
    expect(saida).toMatchObject({ id: 2, estoqueAnterior: 15, estoqueAtual: 12 });
    expect(servico.listarEstoque()[0].estoque).toBe(12);
    expect(produtos[0].estoque).toBe(10);
  });

  test('rejeita dados inválidos sem alterar o estoque', () => {
    const servico = criarServicoEstoque(produtos);
    const registrar = (dados) =>
      servico.registrarMovimentacao({
        codigoProduto: 101,
        tipo: 'SAIDA',
        descricao: 'Teste',
        quantidade: 1,
        ...dados,
      });

    expect(() => registrar({ codigoProduto: 999 })).toThrow('Produto não encontrado.');
    expect(() => registrar({ quantidade: 0 })).toThrow(
      'Quantidade deve ser um número inteiro maior que zero.',
    );
    expect(() => registrar({ quantidade: 11 })).toThrow('Estoque insuficiente.');
    expect(() => registrar({ tipo: 'AJUSTE' })).toThrow('Tipo de movimentação inválido.');
    expect(servico.listarEstoque()[0].estoque).toBe(10);
  });
});
