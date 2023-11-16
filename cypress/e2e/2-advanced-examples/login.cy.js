describe("Login Test", () => {
  it("Successfully logs in", () => {
    // Define API
    cy.intercept("POST", "/api/auth/login").as("loginRequest");
    cy.intercept("GET", "/project/1/construction/master/cluster").as(
      "getCluster"
    );
    cy.intercept("POST", "project/1/construction/master/cluster").as(
      "postCluster"
    );

    //Visit login
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

    //Visit Master
    // cy.visit("https://rem-fe.stg.happyhomes.id/projects/1/construction/master/clusters");
    cy.contains("Project Testing Production").click();
    cy.get('[data-testid="ArrowBackIosSharpIcon"]').click();
    cy.contains("Konstruksi").click();
    cy.contains("Master").click();

    //Create Tahap
    cy.contains("Tahap").click();
    cy.contains("Tambah Tahap").click();
    cy.get('input[name="name"]').type("1");
    cy.get('[placeholder="DD/MM/YYYY"]').type("16/11/2023");
    cy.contains("Simpan").click();
    cy.contains("Tidak dapat menambahkan tahap dengan nama tahap yang sama");
    cy.get("body").click(0, 0);

    //Create Cluster
    // cy.contains("Cluster").click();
    // cy.contains("Tambah Cluster").click();
    // cy.get('input[name="name"]').type("fuschia");
    // cy.contains("Simpan").click();
    // cy.wait("@postCluster");
  });
});
