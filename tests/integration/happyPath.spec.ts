/// <reference types="Cypress" />

context('Happy path', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
  });

  it('shows story text', () => {
    cy.get('.Story-text').contains('Lorem ipsum');
    cy.get('.Story-title').contains('Lorem Ipsum');
    cy.get('.Story-author').contains('Cicero');
  });
});