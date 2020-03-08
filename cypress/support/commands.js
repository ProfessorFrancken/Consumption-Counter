// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Login without using the UI
Cypress.Commands.add('login', (email, password) => {
  localStorage.setItem(
    'plus_one_authorization',
    JSON.stringify({
      token:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1ODM0MjQzMTAsImV4cCI6MTYxNDk2MDMxMCwicGx1cy1vbmUiOnRydWV9.fg_63iOQ64E3lrfhQaw0gSOAWtmviqWhpYl72ME_7sE'
    })
  );
  cy.visit('/');
  cy.get('.tilesGrid').should('contain', 'Admiraal');
});

Cypress.Commands.add(
  'selectMember',
  ({ nthSurname = 1, nthFirstname = 1, name = 'Joris Admiraal' } = {}) => {
    cy.get(`.tilesGrid > :nth-child(${nthSurname})`).click();
    cy.get('.tilesGrid').should('contain', name);
    cy.get(`.tilesGrid > :nth-child(${nthFirstname})`).click();

    // Check that we have selected the given member by comparing the page title
    cy.get('.titleName > span').should('contain', name);
  }
);

Cypress.Commands.add('buyIceTea', ({ product = 'Ice Tea' } = {}) => {
  cy.get('.productsGrid > :nth-child(2)').should('contain', product);
  cy.get('.productsGrid > :nth-child(2) > :nth-child(3)').should(
    'contain',
    product
  );
  cy.get('.productsGrid > :nth-child(2) > :nth-child(3)').click();
});
