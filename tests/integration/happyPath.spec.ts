/// <reference types="Cypress" />

context('Happy path', () => {
  it('shows story text', () => {
    cy.visit('http://localhost:8080/');

    cy.get('.Story-title').contains('Gibberish');
    cy.get('.Story-author').contains('J.S. Rando');
    cy.get('.Story-text').should('exist');
    cy.get('.Story-fin').should('exist');
  });

  /*
  it('loads a story from the URL', () => {
    cy.server();
    cy.route(
      'http://www.example.com/story/42',
      {text: 'Hello, world!'}
    ).as('externalStory');

    cy.visit('http://localhost:8080/?url=http://www.example.com/story/42');

    cy.wait('@externalStory');

    cy.get('.Story-text').contains('Hello, world!');
  });
  */
});