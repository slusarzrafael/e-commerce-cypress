export class LoginPage {
  static credentials(usernameKey = 'username') {
    const username = Cypress.env(usernameKey)
    const password = Cypress.env('password')
    if (typeof username !== 'string' || !username.trim() ||
        typeof password !== 'string' || !password.trim()) {
      throw new Error(`Configure ${usernameKey} e password em cypress.env.json.`)
    }
    return { username, password }
  }

  static visit() {
    cy.visit('/')
    cy.get('[data-test="login-button"]').should('be.visible')
  }

  static fill(username = '', password = '') {
    cy.get('[data-test="username"]').clear()
    if (username) cy.get('[data-test="username"]').type(username, { log: false })
    cy.get('[data-test="password"]').clear()
    if (password) cy.get('[data-test="password"]').type(password, { log: false })
  }

  static submit() {
    cy.get('[data-test="login-button"]').click()
  }

  static expectError(message) {
    cy.get('[data-test="error"]').should('be.visible').and('have.text', message)
    cy.location('pathname').should('eq', '/')
  }
}
