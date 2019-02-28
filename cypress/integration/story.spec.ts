/// <reference types="Cypress" />

context('Story', () => {
  const chai = require('chai');

  beforeEach(() => {
    indexedDB.deleteDatabase('localforage');
  });

  describe('loads a story', () => {
    it('with author and title', () => {
      cy.server();
      const storyUrl = 'http://www.example.com/story/42';
      const storyText = 'Hello, world!';
      cy.route(storyUrl, storyText).as('externalStory');

      cy.visit('/story');

      cy.get('[placeholder="story url"]').focus().type(storyUrl);
      cy.get('[placeholder="story title"]').focus().type('A Greeting');
      cy.get('[placeholder="story author"]').focus().type('CS Tradition');
      cy.contains('Read Story').click();

      cy.wait('@externalStory');

      cy.title().should('be', 'Colibri: A Greeting — CS Tradition');
      cy.get('.Story-title').contains('A Greeting');
      cy.get('.Story-author').contains('CS Tradition');
      cy.get('.Story-text').contains(storyText);
      cy.get('.Story-pages').contains('page 1 of 1');
      cy.get('.Story-url').should('not.exist');
    });

    it('without author or title', () => {
      cy.server();
      const storyUrl = 'http://www.example.com/story/42';
      const storyText = 'Hello, world!';
      cy.route(storyUrl, storyText).as('externalStory');

      cy.visit('/story');

      cy.get('[placeholder="story url"]').focus().type(storyUrl);
      cy.contains('Read Story').click();

      cy.wait('@externalStory');

      cy.title().should('eq', `Colibri: ${storyUrl}`);
      cy.get('.Story-url').contains(storyUrl);
      cy.get('.Story-text').contains(storyText);
      cy.get('.Story-pages').contains('page 1 of 1');
      cy.get('.Story-title').should('not.exist');
      cy.get('.Story-author').should('not.exist');
    });
  });

  it('does not try to load a story without a URL', () => {
    cy.visit('/story');

    cy.get('[placeholder="story author"]').focus().type('CS Tradition');
    cy.get('[placeholder="story title"]').focus().type('A Greeting');
    cy.contains('Read Story').click({ force: true });

    cy.contains('Read Story').should('exist');
    cy.get('.Story').should('not.exist');
  });

  it('shows a failure message if it cannot load the story', () => {
    cy.server();
    cy.route({ url: /.*/, status: 500 }).as('serverError');

    cy.visit('/story');

    cy.get('[placeholder="story url"]').focus().type('some url');
    cy.contains('Read Story').click();

    cy.wait('@serverError');

    cy.contains('Failed to load.');
  });

  // No test for current or total page updates because Cypress/jsdom don't seem
  // to support resize or scroll events, or scrollHeights, properly.

});