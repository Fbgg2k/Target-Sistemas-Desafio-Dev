const fs = require('node:fs');
const path = require('node:path');
const { createInterface } = require('node:readline/promises');
const { stdin, stdout } = require('node:process');
const { exibirComissoes } = require('./modules/comissao/comissao.controller');
const { exibirMovimentacao } = require('./modules/estoque/estoque.controller');
const { criarRepositorioEstoque } = require('./modules/estoque/estoque.repository');
const { criarServicoEstoque } = require('./modules/estoque/estoque.service');
const { exibirCalculoJuros } = require('./modules/juros/juros.controller');

function lerDados(nomeArquivo) {
  const caminho = path.join(__dirname, '..', 'data', nomeArquivo);
  return JSON.parse(fs.readFileSync(caminho, 'utf8'));
}

function lerNumero(entrada, label) {
  const valor = Number(entrada.trim().replace(',', '.'));
  if (!Number.isFinite(valor)) {
    throw new Error(`${label} inválido.`);
  }

  return valor;
}

async function executar() {
  const vendas = lerDados('vendas.json').vendas;
  const dadosEstoque = lerDados('estoque.json').estoque;
  const caminhoEstado = path.join(__dirname, '..', 'data', 'estoque-estado.json');
  const repositorioEstoque = criarRepositorioEstoque(caminhoEstado, dadosEstoque);
  const estadoEstoque = repositorioEstoque.carregar();
  const servicoEstoque = criarServicoEstoque(
    estadoEstoque.estoque,
    estadoEstoque.movimentacoes,
    repositorioEstoque.salvar,
  );
  const terminal = createInterface({ input: stdin, output: stdout });

  try {
    let continuar = true;
    while (continuar) {
      stdout.write('\n=================================\n');
      stdout.write('       DESAFIO DEV - NODE.JS\n');
      stdout.write('=================================\n');
      stdout.write('1 - Calcular comissões\n');
      stdout.write('2 - Movimentar estoque\n');
      stdout.write('3 - Calcular juros\n');
      stdout.write('0 - Sair\n');

      const opcao = (await terminal.question('\nEscolha uma opção: ')).trim();

      try {
        if (opcao === '1') {
          exibirComissoes(vendas);
        } else if (opcao === '2') {
          const codigoProduto = lerNumero(
            await terminal.question('Código do produto: '),
            'Código do produto',
          );
          const tipo = await terminal.question('Tipo (ENTRADA/SAIDA): ');
          const quantidade = lerNumero(await terminal.question('Quantidade: '), 'Quantidade');
          const descricao = await terminal.question('Descrição: ');
          exibirMovimentacao(servicoEstoque, { codigoProduto, tipo, quantidade, descricao });
        } else if (opcao === '3') {
          const valor = lerNumero(await terminal.question('Valor: '), 'Valor');
          const vencimento = await terminal.question('Vencimento (AAAA-MM-DD): ');
          exibirCalculoJuros(valor, vencimento);
        } else if (opcao === '0') {
          continuar = false;
        } else {
          stdout.write('Opção inválida.\n');
        }
      } catch (error) {
        stdout.write(`Erro: ${error.message}\n`);
      }
    }
  } finally {
    terminal.close();
  }
}

if (require.main === module) {
  executar().catch((error) => {
    console.error(`Erro ao iniciar a aplicação: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { executar, lerNumero };
