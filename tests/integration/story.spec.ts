/// <reference types="Cypress" />

context('Story', () => {
  const APP_BASE_URL = 'http://localhost:8080';

  it('loads a story from the URL', () => {
    cy.server();
    const storyUrl = 'http://www.example.com/story/42';
    const storyText = 'Hello, world!';
    cy.route(storyUrl, storyText).as('externalStory');

    cy.visit(`${APP_BASE_URL}/story/${storyUrl}`);
    cy.wait('@externalStory');

    cy.get('.Story-text').contains(storyText);
  });

  it('shows a loading indicator', () => {
    cy.visit(`${APP_BASE_URL}/story/unmocked/story/url`);
    cy.contains('Loading...');
  });

  it('shows usage instructions if the story URL is missing', () => {
    cy.visit(`${APP_BASE_URL}/story/`);
    cy.wait(1);
    cy.contains("Add the story's URL to the address bar!");
  });
});