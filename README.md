# SauceDemo E2E - Cypress

Suite JavaScript para https://www.saucedemo.com/, reescrita a partir de
exploracao real com **Playwright MCP**. O alvo anterior, nopCommerce, foi
substituido: suas rotas, seletores e funcionalidades nao se aplicam ao SauceDemo.

O [mapeamento de elementos](docs/mapeamento-elementos.md) registra seletores,
URLs, mensagens exatas e limitacoes observadas em 24/10/2026.

## Instalacao

Requer Node.js 22 ou 24 e npm, compativeis com Cypress 15.
Cypress 16 removeu `Cypress.env()`; a major 15 foi escolhida para cumprir
o requisito de leitura de credenciais por essa API.

```bash
npm ci
```

No primeiro uso, caso o binario nao tenha sido baixado pelo postinstall:

```bash
npx cypress install
```

No Windows com `npm.ps1` bloqueado, use `npm.cmd` e `npx.cmd`.

## Credenciais locais

Crie `cypress.env.json` na raiz. Esse arquivo esta no `.gitignore` e nao deve
ser versionado. Preencha com as credenciais de teste fornecidas para SauceDemo:

```json
{
  "username": "<usuario-padrao>",
  "lockedOutUsername": "<usuario-bloqueado>",
  "password": "<senha-dos-usuarios-de-teste>"
}
```

`username` deve apontar para a conta padrao; contas com defeitos intencionais nao
devem ser usadas como baseline. `lockedOutUsername` e necessario para o cenario
negativo de conta bloqueada. As outras quatro contas especiais podem ser
guardadas no arquivo local, mas nao sao usadas pela suite atual.
As credenciais sao obtidas por `Cypress.env()` e nao estao nos specs/fixtures.
Configuracao ausente ou vazia gera erro explicito. A digitacao de credenciais
usa `log: false`; evidencias de falha ainda podem conter dados da tela.

## Execucao

```bash
npm run cy:open
npm run cy:run
# Equivalente a cy:run:
npx cypress run
```

Por funcionalidade:

```bash
npm run cy:auth
npm run cy:catalog
npm run cy:cart
npm run cy:checkout
npm run cy:validations
```

Os titulos usam `@smoke` e `@regressao` como marcadores organizacionais.
O filtro executavel e feito pelos scripts/specs; nao ha plugin de grep.
Para executar somente um teste, use a interface `cy:open`.

## Estrutura

```text
cypress/
  e2e/
    auth/login-logout.cy.js
    catalog/catalog.cy.js
    cart/cart.cy.js
    checkout/checkout.cy.js
    validations/form-validations.cy.js
  fixtures/test-data.json
  support/
    commands.js
    e2e.js
    pages/
      LoginPage.js
      Menu.js
      CatalogPage.js
      CartPage.js
      CheckoutPage.js
      index.js
```

## Cobertura

| Area | Cenarios |
|---|---|
| Autenticacao | Login real pela UI; senha incorreta; usuario inexistente; conta bloqueada; logout; acesso protegido |
| Catalogo | Seis produtos e precos; detalhe/voltar; menu All Items; quatro ordenacoes conferindo a lista inteira |
| Carrinho | Vazio; inclusao pela listagem/detalhe; dois itens e persistencia apos reload; remocao parcial/total e pelo detalhe |
| Checkout | Pedido completo com dois produtos; subtotal/imposto/total calculados em centavos; arredondamento de um item; cancelar dados/resumo preservando carrinho |
| Validacoes | Textos exatos de username/password obrigatorios e primeiro nome/sobrenome/CEP obrigatorios; demais erros em autenticacao |

Total: **29 testes ativos**, sem `it.skip`.

### Nao aplicavel ao site escolhido

Cadastro, busca, autocomplete, busca avancada, wishlist e comparacao nao existem
na interface explorada. As rotas solicitadas retornaram 404. O catalogo
principal nao possui categorias comerciais, filtros, paginacao, tamanho de
pagina nem alternancia grid/list. Carrinho nao permite editar quantidade
(sempre 1 por produto), aplicar cupons/gift cards ou aceitar termos.

Checkout nao solicita endereco completo nem escolha de frete/pagamento.
Nao ha numero de pedido visivel na pagina de sucesso. O novo botao Generate PDF
order e os destinos de Dynamic Catalog ficam fora da cobertura atual.
Nao foram criados Page Objects, scripts vazios ou testes pulados para simular
essas funcionalidades. Nao sao criados usuarios nem enviados pagamentos reais.

## Isolamento e evidencias

- Page Objects centralizam interacoes e asserts; commands reutilizam
  `cy.login()`, `cy.logout()`, `cy.addToCart(produto)` e `cy.clearCart()`.
- `cy.session()` reaproveita o login por origem/usuario, validando o cookie
  real `session-username`. A visita ao catalogo acontece depois da restauracao,
  nunca se valida uma sessao contra o DOM de uma pagina anterior.
- `testIsolation: true`; cenarios autenticados que alteram estado limpam o
  carrinho via Reset App State + reload no `beforeEach`. Wishlist/compare nao
  precisam de limpeza porque nao existem.
- Asserts retryable de URL, visibilidade, itens e badge sincronizam a UI.
  Sem `cy.wait(numero)`, respostas mockadas, `force: true` ou supressao global
  de excecoes.
- Excecao HTTP restrita: o host entrega a SPA de `/inventory.html` com status
  404 mesmo autenticado (confirmado no Playwright). `cy.visitInventory()` usa
  `failOnStatusCode: false` somente nessa rota, intercepta o documento real e
  exige status 200 ou 404. Os chamadores exigem Products ou o erro exato de
  acesso deslogado. Nao ha overwrite de `cy.visit()` nem bypass global.
- `baseUrl` SauceDemo; viewport 1365x900; uma repeticao em run mode.
- Screenshots automaticos de falha em `cypress/screenshots/`. Videos sao
  gravados e preservados em `cypress/videos/` se qualquer tentativa falhar,
  inclusive quando o retry passar. Videos sem falhas sao removidos.
  Artefatos locais estao no `.gitignore`.
- O demo e publico e mutavel: uma mudanca real de catalogo/preco deve falhar
  explicitamente e exigir novo mapeamento, nao receber fallback silencioso.

## Validacao desta reescrita

Executada em 24/10/2026 no Windows, Node.js 24.22.1, Cypress **15.21.1**
e Electron headless, com `npx.cmd cypress run`:

| Spec | Passaram | Falharam | Pendentes/ignorados |
|---|---:|---:|---:|
| auth/login-logout.cy.js | 6 | 0 | 0 |
| catalog/catalog.cy.js | 7 | 0 | 0 |
| cart/cart.cy.js | 7 | 0 | 0 |
| checkout/checkout.cy.js | 4 | 0 | 0 |
| validations/form-validations.cy.js | 5 | 0 | 0 |
| **Total** | **29** | **0** | **0** |

Nenhum retry foi necessario na execucao final. O catalogo tambem passou
isoladamente (7/7) antes da regressao completa. A sintaxe da configuracao e
`git diff --check` foram validados; o arquivo local de credenciais permanece
ignorado e nao rastreado.

Problemas encontrados e corrigidos durante a validacao:

1. Cypress 16 removeu `Cypress.env()`: dependencias ajustadas para major 15.
2. O documento do catalogo retorna HTTP 404 com a SPA funcional: excecao
   restrita e explicitamente validada pelo command descrito acima.
3. A ordenacao recria o select: a assercao agora busca novamente o elemento
   depois de `.select()`, evitando subject detached sem esperas fixas.

O bloqueio HTTP 403 da versao anterior pertencia ao nopCommerce e nao ocorreu
nesta execucao SauceDemo. Como proximos incrementos, explorar os destinos
Dynamic Catalog, validar o download PDF e executar em Chrome/Firefox no CI.
