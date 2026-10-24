export class Menu {
  static open() {
    cy.get('#react-burger-menu-btn').should('be.visible').click()
    cy.get('[data-test="logout-sidebar-link"]').should('be.visible')
  }

  static close() {
    cy.get('#react-burger-cross-btn').click()
    cy.get('[data-test="logout-sidebar-link"]').should('not.be.visible')
  }

  static allItems() {
    this.open()
    cy.get('[data-test="inventory-sidebar-link"]').click()
    cy.location('pathname').should('eq', '/inventory.html')
  }
}
