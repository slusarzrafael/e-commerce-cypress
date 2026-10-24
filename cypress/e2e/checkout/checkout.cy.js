import { CartPage, CheckoutPage } from '../../support/pages'
import data from '../../fixtures/test-data.json'

describe('Checkout autenticado @regressao', () => {
  beforeEach(() => {
    cy.login()
    cy.clearCart()
    cy.addToCart(data.products.backpack)
  })

  it('confirma o pedido com subtotal, imposto e total corretos @smoke', () => {
    cy.addToCart(data.products.bikeLight)
    CartPage.visit()
    CartPage.checkout()
    CheckoutPage.fill(data.customer)
    CheckoutPage.continue()
    CheckoutPage.expectOverview([data.products.backpack, data.products.bikeLight])
    CheckoutPage.finish()
    CheckoutPage.backHome()
    CartPage.visit()
    CartPage.expectEmpty()
  })

  it('calcula o imposto arredondado de um unico produto', () => {
    CartPage.visit()
    CartPage.checkout()
    CheckoutPage.fill(data.customer)
    CheckoutPage.continue()
    CheckoutPage.expectOverview([data.products.backpack])
  })

  it('cancela os dados pessoais e preserva o carrinho', () => {
    CartPage.visit()
    CartPage.checkout()
    CheckoutPage.cancel()
    cy.location('pathname').should('eq', '/cart.html')
    CartPage.expectProduct(data.products.backpack)
  })

  it('cancela o resumo sem concluir o pedido', () => {
    CartPage.visit()
    CartPage.checkout()
    CheckoutPage.fill(data.customer)
    CheckoutPage.continue()
    CheckoutPage.expectOverview([data.products.backpack])
    CheckoutPage.cancel()
    cy.location('pathname').should('eq', '/inventory.html')
    CartPage.visit()
    CartPage.expectProduct(data.products.backpack)
  })
})
