import { CartPage, CatalogPage } from '../../support/pages'
import data from '../../fixtures/test-data.json'

describe('Carrinho de compras @regressao', () => {
  const { backpack, bikeLight } = data.products

  beforeEach(() => {
    cy.login()
    cy.clearCart()
  })

  it('inicia vazio e permite continuar comprando', () => {
    CartPage.visit()
    CartPage.expectEmpty()
    CartPage.continueShopping()
    CatalogPage.items().should('have.length', 6)
  })

  it('adiciona pela listagem e apresenta produto, preco e quantidade @smoke', () => {
    cy.addToCart(backpack)
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '1')
    CartPage.visit()
    cy.get('[data-test="inventory-item"]').should('have.length', 1)
    CartPage.expectProduct(backpack)
  })

  it('adiciona pelo detalhe do produto', () => {
    CatalogPage.openProduct(backpack)
    CatalogPage.addFromDetail()
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '1')
    CartPage.visit()
    CartPage.expectProduct(backpack)
  })

  it('mantem dois produtos distintos apos recarregar a pagina', () => {
    cy.addToCart(backpack)
    cy.addToCart(bikeLight)
    cy.reload()
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '2')
    CartPage.visit()
    cy.get('[data-test="inventory-item"]').should('have.length', 2)
    CartPage.expectProduct(backpack)
    CartPage.expectProduct(bikeLight)
  })

  it('remove um produto sem remover o outro', () => {
    cy.addToCart(backpack)
    cy.addToCart(bikeLight)
    CartPage.visit()
    CartPage.remove(backpack)
    cy.get('[data-test="inventory-item"]').should('have.length', 1)
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '1')
    CartPage.expectProduct(bikeLight)
  })

  it('remove o ultimo produto e exibe o estado vazio', () => {
    cy.addToCart(backpack)
    CartPage.visit()
    CartPage.remove(backpack)
    CartPage.expectEmpty()
  })

  it('remove o produto pelo detalhe e sincroniza o carrinho', () => {
    CatalogPage.openProduct(backpack)
    CatalogPage.addFromDetail()
    CatalogPage.removeFromDetail()
    CartPage.visit()
    CartPage.expectEmpty()
  })
})
