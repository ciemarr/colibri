/// <reference types="Cypress" />

context('App', () => {
  it('routes /story to the story loader', () => {
    cy.visit('/story');
    cy.get('.StoryLoader');
  });

  it('does not have a catch-all route', () => {
    cy.visit('/url-that-does-not-exist');
    cy.get('.App').contains('Page not found.');
  });
});