# Mapeamento real - SauceDemo

Exploracao em 24/10/2026 com **Playwright MCP**, navegando em
https://www.saucedemo.com/. Alvo da reescrita: Swag Labs, nao nopCommerce.
Seletores abaixo foram extraidos do DOM real; textos de erro foram provocados
nos formularios. Um checkout demonstrativo foi concluido; nenhum cadastro foi criado.

## Escopo e divergencias do pedido

| Funcionalidade solicitada | Evidencia real | Tratamento |
|---|---|---|
| Cadastro | `/register` retornou HTTP 404, sem formulario | Nao aplicavel: genero, nascimento, newsletter, e-mail, senha/confirmacao e suas validacoes |
| Login em `/login` | `/login` retornou HTTP 404; login real em `/` | Usar username e password, nao e-mail |
| Busca | `/search` retornou HTTP 404; catalogo sem campo de busca | Nao aplicavel: autocomplete, termo curto, resultados e busca avancada |
| Categorias | Catalogo principal unico em `/inventory.html` | Testar menu, detalhe e quatro ordenacoes; sem filtros, paginacao, page size ou grid/list no catalogo principal |
| Carrinho em `/cart` | `/cart` retornou HTTP 404; rota real `/cart.html` | Testar inclusao, remocao, persistencia e quantidade fixa 1 |
| Wishlist | `/wishlist` retornou HTTP 404, sem controles no catalogo/detalhe | Nao aplicavel |
| Comparacao | `/compareproducts` retornou HTTP 404, sem controles no catalogo/detalhe | Nao aplicavel, inclusive limite de quatro produtos |
| Checkout | Tres paginas `.html`, dados pessoais e resumo | Nao ha endereco completo, escolha de frete/pagamento ou aceite de termos |

Nao ha specs ficticios, testes pulados ou mensagens presumidas para funcionalidades
inexistentes. Dados dinamicos de cadastro tambem nao se aplicam.

## 1. Cadastro de usuario

URL sondada: `/register` (HTTP 404).

| Elemento | Seletor recomendado | Tipo | Observacoes |
|---|---|---|---|
| Formulario e validacoes de cadastro | Nao existe | Nao aplicavel | Sem campos, radio, selects, newsletter ou mensagem de sucesso observaveis |

## 2. Login e logout

URLs: `/` -> `/inventory.html`; logout retorna a `/`.

| Elemento | Seletor recomendado | Tipo | Observacoes |
|---|---|---|---|
| Username | `[data-test="username"]` | input text | `id/name="user-name"` |
| Password | `[data-test="password"]` | input password | `id/name="password"` |
| Login | `[data-test="login-button"]` | input submit | `id="login-button"` |
| Erro de login | `[data-test="error"]` | mensagem | Texto exato na secao 9 |
| Abrir menu | `#react-burger-menu-btn` | button | Texto acessivel Open Menu |
| Fechar menu | `#react-burger-cross-btn` | button | Texto acessivel Close Menu |
| Logout | `[data-test="logout-sidebar-link"]` | a com role button | Visivel apos abrir menu |
| Todos os produtos | `[data-test="inventory-sidebar-link"]` | a com role button | All Items, retorna ao catalogo |
| Resetar estado | `[data-test="reset-sidebar-link"]` | a com role button | Reset App State; recarregar atualiza botoes |
| Titulo da pagina autenticada | `[data-test="title"]` | span | Products no catalogo |

Sem remember me, recuperacao de senha ou nome de usuario no header.
A autenticacao e evidenciada pela rota Products/menu Logout; cookie
`session-username` observado e usado para validar a sessao, sem depender do DOM
de uma pagina anterior. Usuarios especiais do demo podem apresentar defeitos
intencionais; a jornada positiva usa a conta padrao.

## 3. Busca de produtos

URL sondada: `/search` (HTTP 404).

| Elemento | Seletor recomendado | Tipo | Observacoes |
|---|---|---|---|
| Busca, autocomplete e busca avancada | Nao existe | Nao aplicavel | Sem mensagens de resultados, termo curto ou sem resultados |

## 4. Navegacao e catalogo

URLs: `/inventory.html`, `/inventory-item.html?id=4` (Backpack).

| Elemento | Seletor recomendado | Tipo | Observacoes |
|---|---|---|---|
| Card de produto | `[data-test="inventory-item"]` | container | Seis produtos no catalogo principal |
| Nome do produto | `[data-test="inventory-item-name"]` | div | Usar dentro do card para associar preco/nome |
| Descricao | `[data-test="inventory-item-desc"]` | div | Tambem presente no detalhe |
| Preco | `[data-test="inventory-item-price"]` | div | Tambem presente em carrinho/resumo |
| Detalhe da mochila | `[data-test="item-4-title-link"]` | a com role button | Sauce Labs Backpack |
| Ordenacao | `[data-test="product-sort-container"]` | select | `az`, `za`, `lohi`, `hilo` |
| Voltar ao catalogo | `[data-test="back-to-products"]` | button | Back to products no detalhe |
| Submenu demonstrativo | `[data-test="dynamic-catalog-sidebar-link"]` | a com role button | Dynamic Catalog; expande submenu |
| Container do submenu | `[data-test="dynamic-catalog-submenu"]` | container | Nao e menu de categorias comerciais |
| Opcao Lazy Load | `[data-test="dynamic-catalog-lazy-load-link"]` | a com role button | Destino nao validado nesta exploracao |
| Opcao Spinner | `[data-test="dynamic-catalog-spinner-link"]` | a com role button | Destino nao validado nesta exploracao |
| Opcao Slider | `[data-test="dynamic-catalog-slider-link"]` | a com role button | Destino nao validado nesta exploracao |

Ordenacoes exercitadas e listas completas conferidas: Name (A to Z),
Name (Z to A), Price (low to high), Price (high to low). Exemplos reais:
Backpack $29.99, Bike Light $9.99, Bolt T-Shirt $15.99, Fleece Jacket $49.99,
Onesie $7.99, Test.allTheThings() T-Shirt (Red) $15.99.
O teste de ordenacao deve comparar todos os resultados, nao somente o select.
Na execucao Cypress, a mudanca de ordenacao substituiu o select no DOM;
consultar novamente o elemento depois de selecionar, sem encadear a assercao
ao subject anterior.

## 5. Carrinho

URL: `/cart.html`.

| Elemento | Seletor recomendado | Tipo | Observacoes |
|---|---|---|---|
| Adicionar mochila na listagem | `[data-test="add-to-cart-sauce-labs-backpack"]` | button | Add to cart muda para Remove |
| Adicionar Bike Light | `[data-test="add-to-cart-sauce-labs-bike-light"]` | button | Mesmo comportamento |
| Adicionar no detalhe | `[data-test="add-to-cart"]` | button | Sem sufixo do produto |
| Remover no detalhe | `[data-test="remove"]` | button | Volta a Add to cart |
| Abrir carrinho | `[data-test="shopping-cart-link"]` | a com role button | Nao ha mini-cart |
| Contador | `[data-test="shopping-cart-badge"]` | span | Conta produtos; ausente quando vazio |
| Lista | `[data-test="cart-list"]` | container | Vazia conserva apenas QTY/Description |
| Item | `[data-test="inventory-item"]` | container | Nome, descricao, quantidade, preco e remocao |
| Quantidade | `[data-test="item-quantity"]` | div | Texto 1; nao e input editavel |
| Remover mochila | `[data-test="remove-sauce-labs-backpack"]` | button | Remove sem recarregar pagina |
| Remover Bike Light | `[data-test="remove-sauce-labs-bike-light"]` | button | Mesmo comportamento |
| Continuar comprando | `[data-test="continue-shopping"]` | button | Retorna a `/inventory.html` |
| Iniciar checkout | `[data-test="checkout"]` | button | Abre `/checkout-step-one.html` |

Sucesso e sinalizado por Remove e pelo badge, sem toast textual.
Carrinho vazio: zero `[data-test="inventory-item"]` e badge ausente, **sem mensagem
textual de vazio**. Nao ha quantidade editavel, botao atualizar, subtotal/total
nesta pagina, cupom, gift card ou checkbox de termos. Totais sao exibidos
no resumo do checkout. A exploracao encontrou um item de sessao anterior;
os testes devem limpar o estado antes de cada cenario autenticado.

## 6. Wishlist

URL sondada: `/wishlist` (HTTP 404).

| Elemento | Seletor recomendado | Tipo | Observacoes |
|---|---|---|---|
| Adicionar, visualizar, mover e remover | Nao existe | Nao aplicavel | Sem mensagem de lista vazia |

## 7. Comparacao

URL sondada: `/compareproducts` (HTTP 404).

| Elemento | Seletor recomendado | Tipo | Observacoes |
|---|---|---|---|
| Adicionar, remover e limpar comparacao | Nao existe | Nao aplicavel | Sem pagina/lista de comparacao |

## 8. Checkout autenticado

Fluxo: `/cart.html` -> `/checkout-step-one.html` ->
`/checkout-step-two.html` -> `/checkout-complete.html`.

| Elemento | Seletor recomendado | Tipo | Observacoes |
|---|---|---|---|
| Primeiro nome | `[data-test="firstName"]` | input text | `id="first-name"`, `name="firstName"` |
| Sobrenome | `[data-test="lastName"]` | input text | `id="last-name"`, `name="lastName"` |
| CEP | `[data-test="postalCode"]` | input text | `id="postal-code"`, `name="postalCode"` |
| Erro | `[data-test="error"]` | mensagem | Primeiro campo obrigatorio faltante |
| Continuar | `[data-test="continue"]` | input submit | Abre resumo com dados validos |
| Cancelar | `[data-test="cancel"]` | button | Dados: retorna ao carrinho; resumo: retorna ao catalogo; ambos preservam itens |
| Pagamento informado | `[data-test="payment-info-value"]` | div | SauceCard #31337, nao editavel |
| Envio informado | `[data-test="shipping-info-value"]` | div | Free Pony Express Delivery!, nao editavel |
| Subtotal | `[data-test="subtotal-label"]` | div | Mochila: Item total: $29.99 |
| Imposto | `[data-test="tax-label"]` | div | Mochila: Tax: $2.40 (8%, arredondado) |
| Total | `[data-test="total-label"]` | div | Mochila: Total: $32.39 |
| Confirmar | `[data-test="finish"]` | button | Finish conclui pedido demonstrativo |
| Titulo de sucesso | `[data-test="title"]` | span | Checkout: Complete! |
| Mensagem principal | `[data-test="complete-header"]` | h2 | Thank you for your order! |
| Mensagem complementar | `[data-test="complete-text"]` | div | Your order has been dispatched, and will arrive just as fast as the pony can get there! |
| Voltar para inicio | `[data-test="back-to-products"]` | button | Back Home retorna ao catalogo |
| Gerar PDF | `[data-test="generate-pdf-order"]` | button | Generate PDF order; download fora da cobertura atual |

Nenhum numero de pedido e mostrado na pagina de sucesso. `SauceCard #31337`
e informacao de pagamento, **nao numero de pedido**. Nao foi inspecionado o PDF.
Nao existe bloqueio por termos, formulario de cartao, endereco de cobranca
completo ou selecao de frete. Ao concluir, o badge desaparece.
Mochila + Bike Light: subtotal $39.98, imposto $3.20 e total $43.18.
Recarregar o catalogo preservou os dois itens; Reset App State seguido de
reload eliminou o badge.

## 9. Validacoes e mensagens exatas

| Contexto/condicao provocada | Seletor | Texto exato |
|---|---|---|
| Login vazio | `[data-test="error"]` | Epic sadface: Username is required |
| Username preenchido, senha vazia | `[data-test="error"]` | Epic sadface: Password is required |
| Senha incorreta | `[data-test="error"]` | Epic sadface: Username and password do not match any user in this service |
| Username inexistente | `[data-test="error"]` | Epic sadface: Username and password do not match any user in this service |
| Usuario bloqueado | `[data-test="error"]` | Epic sadface: Sorry, this user has been locked out. |
| Acesso deslogado a `/inventory.html` | `[data-test="error"]` | Epic sadface: You can only access '/inventory.html' when you are logged in. |
| Checkout vazio | `[data-test="error"]` | Error: First Name is required |
| Nome preenchido, sobrenome vazio | `[data-test="error"]` | Error: Last Name is required |
| Nome/sobrenome preenchidos, CEP vazio | `[data-test="error"]` | Error: Postal Code is required |

## Limites e instabilidades observados

- Alguns cliques de ponteiro no Playwright MCP nao ativaram menu/botoes nesta
  sessao. Alternativas de teclado e ativacao DOM no navegador permitiram
  confirmar os elementos e concluir o fluxo. Nao transferir esse contorno para
  os specs: Cypress deve usar cliques normais com verificacao de visibilidade.
- Os destinos do submenu Dynamic Catalog nao foram confirmados; somente a
  existencia/expansao do submenu e seus controles foi observada. Nao confundir
  com categorias, filtros ou paginacao do catalogo principal.
- O demo pode mudar. Os testes nao interceptam respostas para simular sucesso,
  nem ignoram excecoes globais.
- Na revalidacao Playwright, o documento `/inventory.html` retornou HTTP 404
  tanto autenticado (renderizando Products) quanto deslogado (redirecionando
  para `/` com erro de acesso). Esse comportamento tambem foi confirmado por
  Cypress/curl. O command `visitInventory` permite apenas 200/404 nessa rota,
  com alias do documento e asserts obrigatorios de interface nos chamadores;
  outras visitas conservam a validacao HTTP padrao.
- Acoes locais de catalogo/carrinho nao necessitam de alias de rede: asserts de
  URL, itens e badge sincronizam a interface sem `cy.wait(numero)`. O alias
  de documento acima valida a excecao HTTP, nao simula resposta.
