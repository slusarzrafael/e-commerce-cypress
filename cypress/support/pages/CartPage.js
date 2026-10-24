export class CartPage {
  static visit() {
    cy.get('[data-test="shopping-cart-link"]').click()
    cy.location('pathname').should('eq', '/cart.html')
    cy.get('[data-test="title"]').should('have.text', 'Your Cart')
  }

  static expectProduct(product) {
    cy.contains('[data-test="inventory-item"]', product.name).within(() => {
      cy.get('[data-test="inventory-item-name"]').should('have.text', product.name)
      cy.get('[data-test="inventory-item-price"]').should('have.text', `$${product.price.toFixed(2)}`)
      cy.get('[data-test="item-quantity"]').should('have.text', '1')
    })
  }

  static expectEmpty() {
    cy.get('[data-test="cart-list"]').should('be.visible')
    cy.get('[data-test="inventory-item"]').should('not.exist')
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist')
  }

  static remove(product) {
    cy.get(`[data-test="remove-${product.slug}"]`).click()
    cy.contains('[data-test="inventory-item"]', product.name).should('not.exist')
  }

  static continueShopping() {
    cy.get('[data-test="continue-shopping"]').click()
    cy.location('pathname').should('eq', '/inventory.html')
  }

  static checkout() {
    cy.get('[data-test="checkout"]').click()
    cy.location('pathname').should('eq', '/checkout-step-one.html')
    cy.get('[data-test="title"]').should('have.text', 'Checkout: Your Information')
  }
}
