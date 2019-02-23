/// <reference types="Cypress" />

context('Story', () => {
  const APP_BASE_URL = 'http://localhost:8080';

  it('loads a story', () => {
    cy.server();
    const storyUrl = 'http://www.example.com/story/42';
    const storyText = 'Hello, world!';
    cy.route(storyUrl, storyText).as('externalStory');

    cy.visit(`${APP_BASE_URL}/story`);
    cy.get('input[placeholder="story URL"]').focus().type(storyUrl);
    cy.contains('Read Story').click();

    cy.wait('@externalStory');

    cy.get('.Story-text').contains(storyText);
  });
});