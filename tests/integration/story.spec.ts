/// <reference types="Cypress" />

context('Story', () => {
  const APP_BASE_URL = 'http://localhost:8080';

  describe('loads a story', () => {
    it('with author and title', () => {
      cy.server();
      const storyUrl = 'http://www.example.com/story/42';
      const storyText = 'Hello, world!';
      cy.route(storyUrl, storyText).as('externalStory');

      cy.visit(`${APP_BASE_URL}/story`);

      cy.get('input[placeholder="story URL"]').focus().type(storyUrl);
      cy.get('input[placeholder="story title"]').focus().type('A Greeting');
      cy.get('input[placeholder="story author"]').focus().type('CS Tradition');
      cy.contains('Read Story').click();

      cy.wait('@externalStory');

      cy.title().should('eq', 'Colibri: A Greeting — CS Tradition');
      cy.get('.Story-title').contains('A Greeting');
      cy.get('.Story-author').contains('CS Tradition');
      cy.get('.Story-text').contains(storyText);
      cy.get('.Story-url').should('not.exist');
    });

    it('without author or title', () => {
      cy.server();
      const storyUrl = 'http://www.example.com/story/42';
      const storyText = 'Hello, world!';
      cy.route(storyUrl, storyText).as('externalStory');

      cy.visit(`${APP_BASE_URL}/story`);

      cy.get('input[placeholder="story URL"]').focus().type(storyUrl);
      cy.contains('Read Story').click();

      cy.wait('@externalStory');

      cy.title().should('eq', `Colibri: ${storyUrl}`);
      cy.get('.Story-url').contains(storyUrl);
      cy.get('.Story-text').contains(storyText);
      cy.get('.Story-title').should('not.exist');
      cy.get('.Story-author').should('not.exist');
    });
  });

  it('does not try to load a story without a URL', () => {
    cy.visit(`${APP_BASE_URL}/story`);

    cy.get('input[placeholder="story author"]').focus().type('CS Tradition');
    cy.get('input[placeholder="story title"]').focus().type('A Greeting');
    cy.contains('Read Story').click();

    cy.contains('Read Story').should('exist');
    cy.get('.Story').should('not.exist');
  });
});