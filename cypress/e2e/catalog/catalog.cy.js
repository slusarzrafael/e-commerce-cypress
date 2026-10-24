import { CatalogPage, Menu } from '../../support/pages'
import data from '../../fixtures/test-data.json'

describe('Navegacao e ordenacao do catalogo @regressao', () => {
  beforeEach(() => {
    cy.login()
    cy.clearCart()
  })

  it('exibe os seis produtos com os precos mapeados @smoke', () => {
    CatalogPage.items().should('have.length', data.catalog.length)
    data.catalog.forEach((product) => {
      cy.contains('[data-test="inventory-item"]', product.name).within(() => {
        cy.get('[data-test="inventory-item-name"]').should('have.text', product.name)
        cy.get('[data-test="inventory-item-price"]').should('have.text', `$${product.price.toFixed(2)}`)
      })
    })
  })

  it('abre o detalhe e retorna ao catalogo', () => {
    CatalogPage.openProduct(data.products.backpack)
    cy.get('[data-test="inventory-item-desc"]').should('not.be.empty')
    CatalogPage.back()
    CatalogPage.items().should('have.length', 6)
  })

  it('retorna do detalhe pelo menu All Items', () => {
    CatalogPage.openProduct(data.products.backpack)
    Menu.allItems()
    cy.get('[data-test="title"]').should('have.text', 'Products')
    CatalogPage.items().should('have.length', 6)
  })

  for (const { value, label, field, descending } of [
    { value: 'az', label: 'nome crescente', field: 'name', descending: false },
    { value: 'za', label: 'nome decrescente', field: 'name', descending: true },
    { value: 'lohi', label: 'preco crescente', field: 'price', descending: false },
    { value: 'hilo', label: 'preco decrescente', field: 'price', descending: true },
  ]) {
    it(`ordena todos os produtos por ${label}`, () => {
      const expected = [...data.catalog].sort((left, right) =>
        field === 'price' ? left.price - right.price : left.name.localeCompare(right.name))
      if (descending) expected.reverse()
      CatalogPage.sortBy(value)
      CatalogPage.items().should(($items) => {
        expect($items).to.have.length(expected.length)
        const actual = [...$items].map((item) => ({
          name: item.querySelector('[data-test="inventory-item-name"]').textContent,
          price: Number(item.querySelector('[data-test="inventory-item-price"]').textContent.replace('$', '')),
        }))
        // Produtos empatados em preco podem conservar qualquer ordem relativa.
        expect(actual.map((product) => product[field])).to.deep.eq(expected.map((product) => product[field]))
        expect(actual).to.have.deep.members(data.catalog)
      })
    })
  }
})
