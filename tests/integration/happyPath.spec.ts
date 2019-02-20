/// <reference types="Cypress" />

context('Happy path', () => {
  it('loads a story from the URL', () => {
    cy.server();

    const storyUrl = 'http://www.example.com/story/42';
    const storyText = 'Hello, world!';

    cy.route(storyUrl, storyText).as('externalStory');

    cy.visit(`http://localhost:8080/?url=${storyUrl}`);

    cy.wait('@externalStory');

    cy.get('.Story-text').contains(storyText);
  });
});