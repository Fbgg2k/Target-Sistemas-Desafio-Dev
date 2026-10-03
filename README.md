# Target Sistemas - Desafio Dev

Aplicação de linha de comando (CLI) desenvolvida em Node.js para calcular comissões de vendas,
registrar movimentações de estoque e calcular juros por atraso. As regras de negócio ficam em
módulos independentes e são cobertas por testes automatizados.

## Funcionalidades

- Calcula comissão individual por venda e apresenta os totais de vendas e comissão por vendedor.
- Registra entradas e saídas de produtos, sem permitir estoque negativo.
- Mantém o estoque e o histórico de movimentações entre execuções do programa.
- Calcula juros simples de 2,5% por dia de atraso.
- Valida valores, datas, produtos, tipos de movimentação e quantidades.

## Tecnologias

- Node.js e JavaScript (CommonJS)
- npm
- Jest
- ESLint
- Prettier
- Arquivos JSON para os dados; não é necessário banco de dados.

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior

Confira as versões instaladas:

```bash
node --version
npm --version
```

## Instalação

No diretório raiz do projeto, instale as dependências:

```bash
npm install
```

## Execução

Inicie a aplicação com:

```bash
npm start
```

O menu oferece estas opções:

```text
1 - Calcular comissões
2 - Movimentar estoque
3 - Calcular juros
0 - Sair
```

Na opção de estoque, informe o código do produto, o tipo (`ENTRADA` ou `SAIDA`), a quantidade e a
descrição da movimentação. Quantidades devem ser números inteiros positivos. Na opção de juros,
informe o valor e a data de vencimento no formato `AAAA-MM-DD`. Entradas monetárias aceitam ponto ou
vírgula como separador decimal.

## Regras de negócio

### Comissão

A taxa é aplicada individualmente a cada venda:

| Valor da venda                       | Comissão |
| ------------------------------------ | -------: |
| Abaixo de R$ 100,00                  |       0% |
| De R$ 100,00 até abaixo de R$ 500,00 |       1% |
| A partir de R$ 500,00                |       5% |

Os resultados são agrupados por vendedor. A comissão de cada venda é arredondada para centavos antes
de compor o total do vendedor.

### Estoque

O estoque inicial é carregado de `data/estoque.json`. Cada movimentação tem um identificador
sequencial, produto, tipo, descrição, quantidade, saldo anterior e saldo atualizado. Saídas que
excederiam o saldo disponível são rejeitadas.

Após a primeira movimentação válida, o estado atual e o histórico são gravados em
`data/estoque-estado.json`. Esse arquivo é local, ignorado pelo Git e carregado na próxima execução.
O arquivo inicial `data/estoque.json` permanece como referência para uma instalação sem estado salvo.

### Juros por atraso

O cálculo usa juros simples de 2,5% do valor por dia de atraso. Vencimentos na data atual ou no
futuro resultam em zero dias de atraso. Datas devem ser válidas e usar o formato `AAAA-MM-DD`.

## Testes e qualidade

Execute todos os testes automatizados:

```bash
npm test
```

Execute os testes em modo de observação, repetindo-os após alterações:

```bash
npm run test:watch
```

Verifique problemas de lint:

```bash
npm run lint
```

Formate os arquivos de código, testes, dados e documentação incluídos na configuração do Prettier:

```bash
npm run format
```

## Estrutura do projeto

```text
data/
	estoque.json                 # Estoque inicial
	estoque-estado.json          # Estado e histórico locais, gerados em execução
	vendas.json                  # Vendas usadas no cálculo de comissão
src/
	app.js                       # Menu e entrada da CLI
	modules/
		comissao/                  # Serviço e apresentação de comissões
		estoque/                   # Serviço, repositório JSON e apresentação
		juros/                     # Serviço e apresentação do cálculo de juros
	utils/                       # Formatação monetária, datas e validações
tests/                         # Testes unitários e de persistência
```

## Persistência e controle de versão

Não há serviço de banco de dados. Os dados iniciais são versionados em JSON. O arquivo
`data/estoque-estado.json` é criado localmente quando ocorre a primeira movimentação válida e não é
enviado ao repositório, pois está listado no `.gitignore`.
