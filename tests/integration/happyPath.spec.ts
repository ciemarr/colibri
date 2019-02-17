/// <reference types="Cypress" />

context('Happy path', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
  });

  it('shows story text', () => {
    cy.get('body').contains('Hello, world!');
  });
});