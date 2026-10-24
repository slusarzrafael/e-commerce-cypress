export class CatalogPage {
  static visit() {
    cy.visitInventory()
    cy.get('[data-test="title"]').should('have.text', 'Products')
  }

  static items() {
    return cy.get('[data-test="inventory-item"]')
  }

  static sortBy(value) {
    cy.get('[data-test="product-sort-container"]').select(value)
    cy.get('[data-test="product-sort-container"]').should('have.value', value)
  }

  static add(product) {
    cy.get(`[data-test="add-to-cart-${product.slug}"]`).click()
    cy.get(`[data-test="remove-${product.slug}"]`).should('have.text', 'Remove')
  }

  static openProduct(product) {
    cy.get(`[data-test="item-${product.id}-title-link"]`).click()
    cy.location('pathname').should('eq', '/inventory-item.html')
    cy.location('search').should('eq', `?id=${product.id}`)
    cy.get('[data-test="inventory-item-name"]').should('have.text', product.name)
    cy.get('[data-test="inventory-item-price"]').should('have.text', `$${product.price.toFixed(2)}`)
  }

  static addFromDetail() {
    cy.get('[data-test="add-to-cart"]').click()
    cy.get('[data-test="remove"]').should('have.text', 'Remove')
  }

  static removeFromDetail() {
    cy.get('[data-test="remove"]').click()
    cy.get('[data-test="add-to-cart"]').should('have.text', 'Add to cart')
  }

  static back() {
    cy.get('[data-test="back-to-products"]').click()
    cy.location('pathname').should('eq', '/inventory.html')
  }
}
