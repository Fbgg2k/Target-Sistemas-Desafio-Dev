# Escopo Técnico — Desafio Dev

## 1. Objetivo

Implementar as três funcionalidades solicitadas no desafio utilizando **JavaScript com Node.js**, priorizando código organizado, legível, testável e fácil de executar.

O desafio possui três módulos independentes:

1. Cálculo de comissão de vendedores.
2. Controle de movimentação de estoque.
3. Cálculo de juros por atraso.

O documento de origem define as regras de comissão, os produtos iniciais do estoque e o cálculo de multa de 2,5% ao dia. fileciteturn0file0L30-L35

---

# 2. Stack e tecnologias

## Obrigatórias/recomendadas

- **Node.js** — runtime JavaScript.
- **JavaScript (ES2022+)** — linguagem principal.
- **npm** — gerenciamento do projeto e scripts.
- **Jest** — testes unitários.
- **ESLint** — padronização e identificação de problemas no código.
- **Prettier** — formatação automática.
- **Git/GitHub** — versionamento e entrega.

## Persistência

Para este desafio, **não é necessário banco de dados**, pois os dados fornecidos são JSON e o objetivo principal é demonstrar lógica de programação.

Os dados podem ser armazenados em arquivos:

```text
data/
├── vendas.json
└── estoque.json
```

Caso seja desejável evoluir o projeto posteriormente, pode-se adicionar SQLite ou PostgreSQL, mas isso não deve ser necessário para a entrega inicial.

---

# 3. Arquitetura proposta

Estrutura recomendada:

```text
desafio-dev/
├── data/
│   ├── vendas.json
│   └── estoque.json
│
├── src/
│   ├── modules/
│   │   ├── comissao/
│   │   │   ├── comissao.service.js
│   │   │   └── comissao.controller.js
│   │   │
│   │   ├── estoque/
│   │   │   ├── estoque.service.js
│   │   │   └── estoque.controller.js
│   │   │
│   │   └── juros/
│   │       ├── juros.service.js
│   │       └── juros.controller.js
│   │
│   ├── utils/
│   │   ├── currency.js
│   │   ├── date.js
│   │   └── validation.js
│   │
│   └── app.js
│
├── tests/
│   ├── comissao.service.test.js
│   ├── estoque.service.test.js
│   └── juros.service.test.js
│
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── package.json
└── README.md
```

### Responsabilidade das camadas

**Service**

Contém as regras de negócio. Deve ser a parte mais importante e mais testada.

**Controller**

Responsável por receber entradas, chamar os serviços e apresentar os resultados.

**Utils**

Funções reutilizáveis, como formatação monetária, datas e validações.

**Data**

Arquivos JSON fornecidos pelo desafio.

**Tests**

Testes automatizados das regras de negócio.

---

# 4. Módulo 1 — Comissão de vendedores

## 4.1 Regras

O desafio estabelece:

| Valor da venda | Comissão |
|---:|---:|
| Menor que R$ 100,00 | 0% |
| De R$ 100,00 até abaixo de R$ 500,00 | 1% |
| A partir de R$ 500,00 | 5% |

Essas regras devem ser aplicadas **individualmente a cada venda**. fileciteturn0file0L30-L35

Exemplos:

```text
R$ 90,00   → R$ 0,00
R$ 100,00  → R$ 1,00
R$ 250,00  → R$ 2,50
R$ 499,99  → R$ 5,00
R$ 500,00  → R$ 25,00
R$ 1.000,00 → R$ 50,00
```

## 4.2 Entrada

O arquivo `data/vendas.json` deve conter:

```json
{
  "vendas": [
    {
      "vendedor": "João Silva",
      "valor": 1200.50
    }
  ]
}
```

O arquivo original contém vendas de João Silva, Maria Souza, Carlos Oliveira e Ana Lima. fileciteturn0file0L35-L74

## 4.3 Regras do service

Criar:

```text
calcularComissao(valor)
```

E:

```text
calcularComissoes(vendas)
```

A segunda função deve:

1. Percorrer todas as vendas.
2. Calcular a comissão individual.
3. Agrupar os resultados por vendedor.
4. Calcular o total vendido por vendedor.
5. Calcular o total de comissão por vendedor.
6. Retornar os dados estruturados.

Exemplo de retorno:

```json
[
  {
    "vendedor": "João Silva",
    "totalVendas": 10754.70,
    "totalComissao": 540.00
  }
]
```

Os valores acima são apenas um exemplo de estrutura; os valores finais devem ser calculados pelo programa.

## 4.4 Validações

O sistema deve impedir ou tratar:

- valor inexistente;
- valor não numérico;
- valor negativo;
- vendedor vazio;
- venda sem vendedor.

---

# 5. Módulo 2 — Movimentação de estoque

## 5.1 Objetivo

Permitir registrar movimentações de:

- entrada;
- saída.

O desafio exige que cada movimentação possua:

- identificador único;
- descrição para identificar o tipo da movimentação;
- atualização do estoque;
- retorno da quantidade final do produto movimentado. fileciteturn0file0L78-L82

## 5.2 Estoque inicial

O JSON possui cinco produtos:

```text
101 - Caneta Azul - 150
102 - Caderno Universitário - 75
103 - Borracha Branca - 200
104 - Lápis Preto HB - 320
105 - Marcador de Texto Amarelo - 90
```

Esses dados devem ser mantidos no `data/estoque.json`. fileciteturn0file0L84-L109

## 5.3 Modelo de movimentação

Sugestão:

```json
{
  "id": 1,
  "codigoProduto": 101,
  "tipo": "ENTRADA",
  "descricao": "Reposição de estoque",
  "quantidade": 50
}
```

Para saída:

```json
{
  "id": 2,
  "codigoProduto": 101,
  "tipo": "SAIDA",
  "descricao": "Venda de produto",
  "quantidade": 20
}
```

## 5.4 Service

Criar:

```text
registrarMovimentacao(movimentacao)
```

Fluxo:

```text
Receber movimentação
        ↓
Validar dados
        ↓
Localizar produto
        ↓
Validar quantidade
        ↓
Validar saída
        ↓
Atualizar estoque
        ↓
Retornar estoque final
```

## 5.5 Regras

### Entrada

```text
estoqueAtual + quantidade
```

### Saída

```text
estoqueAtual - quantidade
```

### Regra de segurança

Nunca permitir:

```text
estoque < 0
```

Exemplo:

```text
Estoque: 10
Saída: 5

Resultado: 5
```

Tentativa:

```text
Estoque: 10
Saída: 15
```

Resultado esperado:

```text
Erro: estoque insuficiente
```

## 5.6 Identificador único

A solução pode utilizar um contador incremental:

```text
1
2
3
4
...
```

ou `crypto.randomUUID()`.

Para um desafio simples, o contador incremental é suficiente, desde que a aplicação controle a unicidade.

## 5.7 Retorno esperado

Exemplo:

```json
{
  "id": 3,
  "codigoProduto": 101,
  "tipo": "SAIDA",
  "quantidadeMovimentada": 20,
  "estoqueAnterior": 150,
  "estoqueAtual": 130
}
```

---

# 6. Módulo 3 — Cálculo de juros

## 6.1 Regra

O desafio solicita um programa que receba:

- valor;
- data de vencimento;

e calcule o valor dos juros na data atual considerando **multa de 2,5% ao dia**. fileciteturn0file0L114-L114

## 6.2 Fórmula

Para um título vencido:

```text
diasAtraso = dataAtual - dataVencimento

juros = valor × 0,025 × diasAtraso

valorTotal = valor + juros
```

## 6.3 Exemplo

Valor:

```text
R$ 1.000,00
```

Atraso:

```text
3 dias
```

Juros:

```text
1000 × 0,025 × 3
= R$ 75,00
```

Total:

```text
R$ 1.075,00
```

## 6.4 Regras adicionais recomendadas

Se o vencimento for hoje:

```text
diasAtraso = 0
juros = 0
```

Se o vencimento for futuro:

```text
diasAtraso = 0
juros = 0
```

Também validar:

- valor maior que zero;
- data válida;
- data de vencimento informada.

## 6.5 Service

Criar:

```text
calcularJuros(valor, dataVencimento, dataAtual)
```

O parâmetro `dataAtual` deve ser opcional, mas deve existir nos testes para evitar dependência do relógio do sistema.

Exemplo:

```javascript
calcularJuros(
  1000,
  '2026-10-01',
  '2026-10-04'
);
```

Isso torna o teste determinístico.

---

# 7. Interface de execução

Para evitar complexidade desnecessária, a primeira versão pode ser uma aplicação **CLI (Command Line Interface)**.

Ao executar:

```bash
npm start
```

Exibir:

```text
=================================
       DESAFIO DEV - NODE.JS
=================================

1 - Calcular comissões
2 - Movimentar estoque
3 - Calcular juros
0 - Sair

Escolha uma opção:
```

## Comissão

```text
Digite o caminho do arquivo JSON:
Calculando comissões...

João Silva
Total vendido: R$ X.XXX,XX
Comissão: R$ XXX,XX

Maria Souza
Total vendido: R$ X.XXX,XX
Comissão: R$ XXX,XX
```

## Estoque

```text
Código do produto: 101
Tipo: ENTRADA
Quantidade: 20
Descrição: Reposição

Estoque anterior: 150
Estoque atual: 170
```

## Juros

```text
Valor: 1000
Vencimento: 2026-10-01

Dias em atraso: 2
Juros: R$ 50,00
Valor atualizado: R$ 1.050,00
```

---

# 8. Tratamento de erros

Implementar erros claros para o usuário.

Exemplos:

```text
Produto não encontrado.
```

```text
Quantidade deve ser maior que zero.
```

```text
Estoque insuficiente.
```

```text
Valor da venda inválido.
```

```text
Data de vencimento inválida.
```

```text
Tipo de movimentação inválido. Use ENTRADA ou SAIDA.
```

Evitar `try/catch` genérico escondendo erros.

---

# 9. Testes automatizados

Utilizar Jest.

Instalação:

```bash
npm install --save-dev jest
```

No `package.json`:

```json
{
  "scripts": {
    "start": "node src/app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

## Testes de comissão

Testar obrigatoriamente:

```text
R$ 99,99 → 0%
R$ 100,00 → 1%
R$ 499,99 → 1%
R$ 500,00 → 5%
R$ 1.000,00 → 5%
```

Também testar:

- agrupamento por vendedor;
- vendedor inexistente;
- valor inválido;
- valor negativo.

## Testes de estoque

Testar:

```text
Entrada aumenta estoque.
Saída reduz estoque.
Produto inexistente gera erro.
Saída maior que estoque gera erro.
Quantidade zero gera erro.
Quantidade negativa gera erro.
ID da movimentação é único.
```

## Testes de juros

Testar:

```text
Vencimento hoje → juros 0.
Vencimento futuro → juros 0.
1 dia de atraso → 2,5%.
2 dias → 5%.
10 dias → 25%.
```

Também testar:

- data inválida;
- valor inválido;
- valor zero;
- valor negativo.

---

# 10. Precisão monetária

Como o sistema trabalha com dinheiro, evitar depender diretamente de cálculos com ponto flutuante para apresentação.

Exemplo:

```javascript
const comissao = Math.round(valor * percentual * 100) / 100;
```

Para uma evolução de produção, pode-se utilizar uma biblioteca especializada em valores monetários ou trabalhar internamente com centavos.

A saída deve utilizar padrão brasileiro:

```text
R$ 1.250,50
```

Pode ser utilizado:

```javascript
new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});
```

---

# 11. Padrão de código

Utilizar:

- `const` e `let`;
- funções pequenas;
- nomes descritivos;
- `async/await` quando necessário;
- módulos ES (`import/export`) ou CommonJS de forma consistente;
- tratamento explícito de erros;
- comentários somente quando agregarem contexto.

Exemplo:

```javascript
export function calcularComissao(valor) {
  if (valor < 100) {
    return 0;
  }

  if (valor < 500) {
    return valor * 0.01;
  }

  return valor * 0.05;
}
```

---

# 12. Fluxo de desenvolvimento

## Etapa 1 — Preparação

```bash
mkdir desafio-dev
cd desafio-dev
npm init -y
```

Instalar ferramentas:

```bash
npm install --save-dev jest eslint prettier
```

Criar estrutura de pastas.

### Check-in

- [ ] Projeto criado
- [ ] `package.json` criado
- [ ] Git inicializado
- [ ] `.gitignore` criado
- [ ] Estrutura de diretórios criada
- [ ] Dependências instaladas

---

# 13. Check-in 1 — Dados

- [ ] Criar `data/vendas.json`
- [ ] Inserir dados fornecidos no desafio
- [ ] Criar `data/estoque.json`
- [ ] Inserir produtos fornecidos
- [ ] Validar JSON
- [ ] Criar funções para leitura dos arquivos

Commit sugerido:

```bash
git add .
git commit -m "chore: adiciona dados iniciais do desafio"
```

---

# 14. Check-in 2 — Comissão

- [ ] Implementar regra abaixo de R$ 100
- [ ] Implementar regra entre R$ 100 e R$ 499,99
- [ ] Implementar regra a partir de R$ 500
- [ ] Calcular comissão individual
- [ ] Agrupar por vendedor
- [ ] Calcular total vendido
- [ ] Calcular total de comissão
- [ ] Validar entradas
- [ ] Criar testes unitários
- [ ] Validar resultado no terminal

Commit:

```bash
git add .
git commit -m "feat: implementa calculo de comissoes"
```

---

# 15. Check-in 3 — Estoque

- [ ] Implementar consulta de produto
- [ ] Implementar entrada
- [ ] Implementar saída
- [ ] Criar identificador único
- [ ] Registrar descrição
- [ ] Validar quantidade
- [ ] Validar produto
- [ ] Impedir estoque negativo
- [ ] Retornar estoque anterior
- [ ] Retornar estoque atualizado
- [ ] Criar testes unitários

Commit:

```bash
git add .
git commit -m "feat: implementa movimentacao de estoque"
```

---

# 16. Check-in 4 — Juros

- [ ] Receber valor
- [ ] Receber vencimento
- [ ] Calcular dias de atraso
- [ ] Aplicar 2,5% ao dia
- [ ] Calcular juros
- [ ] Calcular valor atualizado
- [ ] Tratar vencimento futuro
- [ ] Tratar vencimento atual
- [ ] Validar data
- [ ] Validar valor
- [ ] Criar testes unitários

Commit:

```bash
git add .
git commit -m "feat: implementa calculo de juros"
```

---

# 17. Check-in 5 — CLI

- [ ] Criar menu principal
- [ ] Criar opção de comissão
- [ ] Criar opção de estoque
- [ ] Criar opção de juros
- [ ] Criar opção de saída
- [ ] Validar entradas do usuário
- [ ] Melhorar mensagens do terminal
- [ ] Formatar valores em BRL

Commit:

```bash
git add .
git commit -m "feat: adiciona interface CLI"
```

---

# 18. Check-in 6 — Qualidade

- [ ] Executar todos os testes
- [ ] Corrigir falhas
- [ ] Executar ESLint
- [ ] Executar Prettier
- [ ] Remover código duplicado
- [ ] Revisar nomes de funções
- [ ] Revisar mensagens de erro
- [ ] Revisar tratamento de valores monetários
- [ ] Revisar tratamento de datas

Comandos:

```bash
npm test
npm run lint
npm run format
```

Commit:

```bash
git add .
git commit -m "chore: aplica melhorias de qualidade"
```

---

# 19. Check-in 7 — README

O README deve explicar:

## 1. Sobre o projeto

Descrição resumida do desafio.

## 2. Tecnologias

```text
Node.js
JavaScript
Jest
ESLint
Prettier
Git
```

## 3. Requisitos

Exemplo:

```text
Node.js 20+
npm 10+
```

## 4. Instalação

```bash
git clone <repositorio>
cd desafio-dev
npm install
```

## 5. Execução

```bash
npm start
```

## 6. Testes

```bash
npm test
```

## 7. Estrutura

Explicar as principais pastas.

## 8. Regras de negócio

Documentar comissão, estoque e juros.

## 9. Exemplos de execução

Adicionar prints ou exemplos do terminal.

---

# 20. Check-in final — Entrega

## Funcionalidades

### Comissão

- [ ] Leitura do JSON
- [ ] Comissão abaixo de R$ 100 = 0%
- [ ] Comissão de R$ 100 a R$ 499,99 = 1%
- [ ] Comissão a partir de R$ 500 = 5%
- [ ] Resultado por vendedor
- [ ] Total de vendas
- [ ] Total de comissão

### Estoque

- [ ] Leitura do JSON
- [ ] Identificação do produto
- [ ] Entrada
- [ ] Saída
- [ ] ID único
- [ ] Descrição
- [ ] Validação de quantidade
- [ ] Bloqueio de estoque negativo
- [ ] Retorno do estoque final

### Juros

- [ ] Recebimento do valor
- [ ] Recebimento da data de vencimento
- [ ] Cálculo dos dias em atraso
- [ ] Aplicação de 2,5% ao dia
- [ ] Cálculo dos juros
- [ ] Cálculo do valor atualizado
- [ ] Tratamento de vencimento futuro
- [ ] Tratamento de vencimento atual

### Qualidade

- [ ] Testes automatizados
- [ ] ESLint sem erros
- [ ] Prettier aplicado
- [ ] Tratamento de erros
- [ ] Código organizado
- [ ] README completo
- [ ] `.gitignore`
- [ ] Commits organizados
- [ ] Projeto executando do zero com `npm install`
- [ ] `npm test` funcionando
- [ ] `npm start` funcionando

---

# 21. Critérios técnicos para apresentação

Durante a apresentação do desafio, destacar:

### Separação de responsabilidades

A regra de negócio não deve ficar diretamente dentro do menu da aplicação.

```text
CLI
 ↓
Controller
 ↓
Service
 ↓
Dados
```

### Testabilidade

As funções devem receber dados como parâmetros sempre que possível.

Exemplo:

```javascript
calcularJuros(valor, dataVencimento, dataAtual)
```

Isso facilita testes determinísticos.

### Validação

Dados inválidos devem gerar mensagens claras, sem permitir que o programa continue com estado inconsistente.

### Manutenibilidade

As regras devem ficar centralizadas nos services.

Por exemplo:

```text
comissao.service.js
estoque.service.js
juros.service.js
```

Assim, uma alteração futura na taxa de comissão não exige modificar toda a aplicação.

---

# 22. Evoluções futuras

Depois da versão solicitada pelo desafio, o projeto poderia evoluir para:

```text
Frontend React
       ↓
API REST Node.js
       ↓
Services
       ↓
Repository
       ↓
PostgreSQL
```

Possíveis endpoints:

```text
GET    /vendas
GET    /comissoes
POST   /estoque/movimentacoes
GET    /estoque
GET    /estoque/:codigoProduto
POST   /juros/calcular
```

Também poderiam ser adicionados:

- autenticação;
- banco de dados;
- histórico de movimentações;
- API REST;
- Swagger/OpenAPI;
- Docker;
- CI/CD;
- logs;
- frontend React.

Essas funcionalidades são **evoluções**, não requisitos necessários para a primeira entrega do desafio.

---

# 23. Checklist final rápido

```text
[x] Node.js configurado
[x] Projeto npm criado
[x] Git configurado
[x] Dados JSON adicionados

[x] Comissão implementada
[x] Comissão testada
[x] Estoque implementado
[x] Estoque testado
[x] Juros implementado
[x] Juros testado

[x] CLI implementada
[x] Validações implementadas
[x] Tratamento de erros implementado

[x] Jest OK
[x] ESLint OK
[x] Prettier OK

[x] README OK
[x] .gitignore OK
[ ] Commits OK

[x] npm install funciona
[x] npm test funciona
[x] npm start funciona

[ ] Repositório GitHub revisado
[ ] Projeto pronto para entrega
```

# 24. Resultado esperado

Ao final, o projeto deverá ser uma aplicação Node.js executável pelo terminal, contendo três módulos independentes e testados:

```text
                    DESAFIO DEV
                         │
          ┌──────────────┼──────────────┐
          │              │              │
       COMISSÃO       ESTOQUE         JUROS
          │              │              │
       Vendas        Entradas/        Atraso
       Comissão        Saídas          2,5%/dia
          │              │              │
          └──────────────┼──────────────┘
                         │
                     Node.js
                         │
              Jest + ESLint + Git
```

A prioridade deve ser **entregar integralmente os três requisitos originais com código simples, organizado, validado e testado**, deixando React, API REST e banco de dados como possíveis extensões.
