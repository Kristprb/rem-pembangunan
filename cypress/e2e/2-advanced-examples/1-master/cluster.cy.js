import "../../../support/commands";

describe("Cluster Test", () => {
  beforeEach(() => {
    cy.login("kristianepurba@happyhomes.id", "testing12"); // Menggunakan fungsi login yang Anda buat
  });

  it("cretate cluster", () => {
    //Create Cluster
    cy.url().should("include", "/projects"); // assuming successful login redirects to dashboard
    cy.contains("Daftar Project");

    //Visit Master
    // cy.visit("https://rem-fe.stg.happyhomes.id/projects/1/construction/master/clusters");
    cy.contains("Project Testing Production").click();
    cy.get('[data-testid="ArrowBackIosSharpIcon"]').click();
    cy.contains("Konstruksi").click();
    cy.contains("Master").click();
    cy.contains("Cluster").click();
    cy.contains("Tambah Cluster").click();
    cy.get('input[name="name"]').type("fuschia");
    cy.contains("Simpan").click();
    cy.wait("@postCluster");
  });
});
