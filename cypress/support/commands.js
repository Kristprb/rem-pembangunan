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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add("login", (username, password) => {
  // Your login logic here
  // For example:
  cy.intercept("POST", "/api/auth/login").as("loginRequest");
  cy.visit("https://rem-fe.stg.happyhomes.id/");

  // Fill in the username and password
  cy.get('input[name="email"]').type(username);
  cy.get('input[name="password"]').type(password);

  // Click the login button
  cy.get('button[type="submit"]').click();
  cy.wait("@loginRequest");
  cy.contains("Selamat Datang");
  cy.wait(2000);
});
