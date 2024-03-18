import "../../../support/commands";

const navigateToMaster = () => {
  cy.contains("Project Testing Production").click();
  cy.get('[data-testid="ArrowBackIosSharpIcon"]').click();
  cy.contains("Konstruksi").click();
  cy.contains("Master").click();
};

describe("Stages Test", () => {
  beforeEach(() => {
    cy.login("kristianepurba@happyhomes.id", "testing12");
    cy.url().should("include", "/projects");
    cy.contains("Daftar Project");
    navigateToMaster();
  });

  it("creating a new stage and handling duplicate stage creation", () => {
    cy.intercept("GET", "/project/*/construction/master/stage*").as(
      "getStages"
    );
    cy.intercept("POST", "/project/*/construction/master/stage").as(
      "postStage"
    );

    cy.wait("@getStages");
    createStage("2", "16/11/2023");
    createStage("1", "16/11/2023");
    createStage("2", "16/11/2023");

    cy.contains("Tidak dapat menambahkan tahap dengan nama tahap yang sama");
    cy.get("body").click(0, 0);
  });

  it("editing and handling duplicate stage updates", () => {
    cy.intercept("GET", "/project/*/construction/master/stage*").as(
      "getStages"
    );
    cy.intercept("PATCH", "/project/*/construction/master/stage").as(
      "patchStage"
    );

    cy.wait("@getStages");
    editStage(1, "3");
    editStage(1, "3");

    cy.contains("Tidak dapat menambahkan tahap dengan nama tahap yang sama");
    cy.get("body").click(0, 0);
    cy.contains("Batalkan").click();
  });

  it("Search a stage", () => {
    cy.intercept("GET", "/project/*/construction/master/stage*").as(
      "getStages"
    );
    cy.intercept("PATCH", "/project/*/construction/master/stage").as(
      "patchStage"
    );

    cy.wait("@getStages");
    searchStage("3");
    searchStage("100");

    cy.contains("Pencarian tidak ada");
    cy.get("body").click(0, 0);
    cy.contains("Batalkan").click();
  });

  it("delete a stage", () => {
    cy.intercept("DELETE", "/project/*/construction/master/stage/*").as(
      "deleteStage"
    );

    deleteStage(1);
    deleteStage(1);
  });
});

function createStage(name, date) {
  cy.contains("Tahap").click();
  cy.contains("Tambah Tahap").click();
  cy.get('input[name="name"]').type(name);
  cy.get('[placeholder="DD/MM/YYYY"]').type(date);
  cy.contains("Simpan").click();
  cy.wait("@postStage").then((interception) => {
    cy.wait(2000);
    if (interception.response.statusCode === 200) {
      cy.contains(`Tahap ${name} berhasil ditambah`);
      cy.get("body").click(0, 0);
      cy.contains("Tahap " + name);
    }
  });
}

function editStage(rowIndex, newName) {
  selectStageAction(rowIndex, "Edit");
  cy.get('input[name="name"]').clear().type(newName);
  cy.contains("Simpan").click();
  cy.wait("@patchStage").then((interception) => {
    cy.wait(2000);
    if (interception.response.statusCode === 200) {
      cy.contains("Tahap berhasil diupdate");
      cy.get("body").click(0, 0);
      cy.contains("Tahap " + newName);
    }
  });
}

function deleteStage(rowIndex) {
  selectStageAction(rowIndex, "Delete");
  cy.contains("button", "Hapus").click();
  cy.wait("@deleteStage");

  cy.contains("Tahap berhasil dihapus");
  cy.get("body").click(0, 0);
}

function selectStageAction(rowIndex, action) {
  cy.get("table.MuiTable-root")
    .find("tr.MuiTableRow-root")
    .eq(rowIndex)
    .find(".MuiIconButton-sizeMedium")
    .click();
  cy.wait(1500);
  cy.contains(action).click();
}

function searchStage(rowIndex, action) {
  cy.get("table.MuiTable-root")
    .find("tr.MuiTableRow-root")
    .eq(rowIndex)
    .find(".MuiIconButton-sizeMedium")
    .click();
  cy.get('[data-testid="CloseIcon"]').click();
  cy.wait(1500);
  cy.contains(action).click();
}
