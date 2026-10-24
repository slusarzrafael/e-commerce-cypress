export class CheckoutPage {
  static fill({ firstName = '', lastName = '', postalCode = '' }) {
    for (const [field, value] of Object.entries({ firstName, lastName, postalCode })) {
      cy.get(`[data-test="${field}"]`).clear()
      if (value) cy.get(`[data-test="${field}"]`).type(value)
    }
  }

  static continue() {
    cy.get('[data-test="continue"]').click()
  }

  static expectError(message) {
    cy.get('[data-test="error"]').should('be.visible').and('have.text', message)
    cy.location('pathname').should('eq', '/checkout-step-one.html')
  }

  static expectOverview(products) {
    cy.location('pathname').should('eq', '/checkout-step-two.html')
    cy.get('[data-test="title"]').should('have.text', 'Checkout: Overview')
    cy.get('[data-test="inventory-item"]').should('have.length', products.length)
    for (const product of products) {
      cy.contains('[data-test="inventory-item"]', product.name).within(() => {
        cy.get('[data-test="inventory-item-price"]').should('have.text', `$${product.price.toFixed(2)}`)
        cy.get('[data-test="item-quantity"]').should('have.text', '1')
      })
    }
    const subtotalCents = products.reduce((sum, product) => sum + Math.round(product.price * 100), 0)
    const taxCents = Math.round(subtotalCents * 0.08)
    cy.get('[data-test="subtotal-label"]').should('have.text', `Item total: $${(subtotalCents / 100).toFixed(2)}`)
    cy.get('[data-test="tax-label"]').should('have.text', `Tax: $${(taxCents / 100).toFixed(2)}`)
    cy.get('[data-test="total-label"]').should('have.text', `Total: $${((subtotalCents + taxCents) / 100).toFixed(2)}`)
    cy.get('[data-test="payment-info-value"]').should('have.text', 'SauceCard #31337')
    cy.get('[data-test="shipping-info-value"]').should('have.text', 'Free Pony Express Delivery!')
  }

  static cancel() {
    cy.get('[data-test="cancel"]').click()
  }

  static finish() {
    cy.get('[data-test="finish"]').click()
    cy.location('pathname').should('eq', '/checkout-complete.html')
    cy.get('[data-test="title"]').should('have.text', 'Checkout: Complete!')
    cy.get('[data-test="complete-header"]').should('have.text', 'Thank you for your order!')
    cy.get('[data-test="complete-text"]').should('have.text',
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!')
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist')
  }

  static backHome() {
    cy.get('[data-test="back-to-products"]').click()
    cy.location('pathname').should('eq', '/inventory.html')
  }
}
