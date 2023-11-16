describe("Project", () => {
  it("Successfully create project", () => {
    // Visit the project page
    cy.intercept("GET", "/project").as("loginRequest");
    cy.visit("https://rem-fe.stg.happyhomes.id/");

    // Fill in the username and password
    cy.get('input[name="email"]').type("kristiane@realtegic.co.id");
    cy.get('input[name="password"]').type("testing12");

    // Click the login button
    cy.get('button[type="submit"]').click();
    cy.wait("@loginRequest");
    cy.contains("Selamat Datang");

    // Assert that we have logged in successfully
    cy.url().should("include", "/projects"); // assuming successful login redirects to dashboard
    cy.contains("Daftar Project");
  });
});
