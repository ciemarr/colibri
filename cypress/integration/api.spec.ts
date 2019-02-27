/// <reference types="Cypress" />

context('API', () => {
  const APP_BASE_URL = 'http://localhost:3000';

  xit('can hit an API endpoint', () => {
    cy.visit(`${APP_BASE_URL}/api/foo`);
    cy.get('*').contains('api call');
  });
});