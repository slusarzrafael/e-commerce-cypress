import { CatalogPage, LoginPage, Menu } from './pages'

Cypress.Commands.add('visitInventory', () => {
  // O host entrega o HTML da SPA com 404 nesta rota, inclusive autenticado.
  cy.intercept('GET', '**/inventory.html').as('inventoryDocument')
  cy.visit('/inventory.html', { failOnStatusCode: false })
  cy.wait('@inventoryDocument').then(({ response }) => {
    expect(response, 'resposta do documento do catalogo').to.exist
    expect(response.statusCode, 'status conhecido da rota SPA').to.be.oneOf([200, 404])
  })
})

Cypress.Commands.add('login', () => {
  const { username, password } = LoginPage.credentials()
  cy.session([Cypress.config('baseUrl'), username], () => {
    LoginPage.visit()
    LoginPage.fill(username, password)
    LoginPage.submit()
    cy.location('pathname').should('eq', '/inventory.html')
    cy.get('[data-test="title"]').should('have.text', 'Products')
  }, {
    cacheAcrossSpecs: true,
    validate() {
      cy.getCookie('session-username').should('have.property', 'value', username)
    },
  })
  CatalogPage.visit()
})

Cypress.Commands.add('logout', () => {
  Menu.open()
  cy.get('[data-test="logout-sidebar-link"]').click()
  cy.location('pathname').should('eq', '/')
  cy.get('[data-test="login-button"]').should('be.visible')
  cy.getCookie('session-username').should('be.null')
})

Cypress.Commands.add('addToCart', (product) => {
  CatalogPage.add(product)
})

Cypress.Commands.add('clearCart', () => {
  Menu.open()
  cy.get('[data-test="reset-sidebar-link"]').click()
  Menu.close()
  // Reset App State limpa o storage; o reload sincroniza os botoes do catalogo.
  cy.reload()
  cy.get('[data-test="title"]').should('have.text', 'Products')
  cy.get('[data-test="shopping-cart-badge"]').should('not.exist')
  cy.get('[data-test="inventory-item"] button').should('have.length', 6)
    .each(($button) => expect($button.text()).to.eq('Add to cart'))
})
