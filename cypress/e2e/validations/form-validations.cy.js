import { CartPage, CheckoutPage, LoginPage } from '../../support/pages'
import data from '../../fixtures/test-data.json'

describe('Mensagens exatas de validacao @regressao', () => {
  describe('Login', () => {
    beforeEach(() => LoginPage.visit())

    it('solicita username quando o formulario esta vazio', () => {
      LoginPage.submit()
      LoginPage.expectError(data.messages.usernameRequired)
    })

    it('solicita password quando somente username foi informado', () => {
      LoginPage.fill(LoginPage.credentials().username)
      LoginPage.submit()
      LoginPage.expectError(data.messages.passwordRequired)
    })
  })

  describe('Informacoes do checkout', () => {
    beforeEach(() => {
      cy.login()
      cy.clearCart()
      cy.addToCart(data.products.backpack)
      CartPage.visit()
      CartPage.checkout()
    })

    for (const { label, customer, message } of [
      { label: 'primeiro nome', customer: {}, message: data.messages.firstNameRequired },
      { label: 'sobrenome', customer: { firstName: data.customer.firstName }, message: data.messages.lastNameRequired },
      { label: 'CEP', customer: { ...data.customer, postalCode: '' }, message: data.messages.postalCodeRequired },
    ]) {
      it(`solicita ${label} e impede avancar com o campo vazio`, () => {
        CheckoutPage.fill(customer)
        CheckoutPage.continue()
        CheckoutPage.expectError(message)
      })
    }
  })
})
