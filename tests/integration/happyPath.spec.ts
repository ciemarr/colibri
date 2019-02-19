/// <reference types="Cypress" />

context('Happy path', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
  });

  it('shows story text', () => {
    cy.get('.Story-title').contains('Gibberish');
    cy.get('.Story-author').contains('J.S. Rando');
    cy.get('.Story-text').should('exist');
    cy.get('.Story-fin').should('exist');
  });
});