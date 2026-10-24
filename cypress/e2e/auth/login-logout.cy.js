import { LoginPage } from '../../support/pages'
import data from '../../fixtures/test-data.json'

describe('Autenticacao no SauceDemo @regressao', () => {
  it('entra pela interface com credenciais validas @smoke', () => {
    const { username, password } = LoginPage.credentials()
    LoginPage.visit()
    LoginPage.fill(username, password)
    LoginPage.submit()
    cy.location('pathname').should('eq', '/inventory.html')
    cy.get('[data-test="title"]').should('have.text', 'Products')
    cy.get('[data-test="inventory-item"]').should('have.length', 6)
  })

  it('rejeita senha incorreta', () => {
    LoginPage.visit()
    LoginPage.fill(LoginPage.credentials().username, data.invalidLogin.password)
    LoginPage.submit()
    LoginPage.expectError(data.messages.invalidCredentials)
  })

  it('rejeita usuario inexistente', () => {
    LoginPage.visit()
    LoginPage.fill(data.invalidLogin.username, LoginPage.credentials().password)
    LoginPage.submit()
    LoginPage.expectError(data.messages.invalidCredentials)
  })

  it('informa que a conta esta bloqueada', () => {
    const { username, password } = LoginPage.credentials('lockedOutUsername')
    LoginPage.visit()
    LoginPage.fill(username, password)
    LoginPage.submit()
    LoginPage.expectError(data.messages.lockedOut)
  })

  it('encerra a sessao e volta ao estado deslogado @smoke', () => {
    cy.login()
    cy.logout()
    cy.visitInventory()
    LoginPage.expectError(data.messages.unauthorizedInventory)
  })

  it('impede acesso direto ao catalogo sem autenticacao', () => {
    cy.visitInventory()
    LoginPage.expectError(data.messages.unauthorizedInventory)
  })
})
