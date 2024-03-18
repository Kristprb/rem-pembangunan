import "../../../support/commands";

const navigateToPembangunan = () => {
  cy.contains("The Leaf Residence").click();
  cy.get('[data-testid="ArrowBackIosSharpIcon"]').click();
  cy.contains("Konstruksi").click();
  cy.contains("Pembangunan").click();
};

describe("Unit Test", () => {
  beforeEach(() => {
    cy.login("kristianepurba@happyhomes.id", "testing12");
    cy.url().should("include", "/projects");
    cy.contains("Daftar Project");
    navigateToPembangunan();
  });

  // Tambah Unit yang sudah ada

  it("creating a new unit and handling duplicate unit creation", () => {
    cy.intercept("GET", "/project/*/construction/development/unit/*").as(
      "getUnit"
    );
    cy.intercept("POST", "/project/*/construction/development/unit").as(
      "postUnit"
    );

    cy.wait("@getUnit");
    createDuplicateUnit(
      "Tahap 3",
      "Cluster Bougenville",
      "Blok E",
      "33/72 Standar",
      "10"
    );

    cy.contains("Kembali ke Daftar Unit").click();
    cy.contains("Batal").click();
    cy.wait(2000);

    // Tambah Unit yang baru
    createDataUnit(
      "Tahap 3",
      "Cluster Alamanda",
      "Blok A",
      "24/66 Premium",
      "2",
      "5"
    );

    // Tambah RAB baru

    createRabNewPekerjaan({
      job: "PEKERJAAN PONDASI",
      jobItem: "Pasir urug, t = 5 cm",
      uom: "m³",
      volume: 1.35,
      material: "Pintu",
      uom1: "m³",
      volume1: 1.1,
      price: "210.000",
      uom2: "Oh",
      volume2: 0.3,
      price1: "120.000",
      manPower: "Mandor",
      desc: "Penambahan 1 pekerjaan",
    });
  });

  it("Search, Filter, Sorting, Pagination test", () => {
    cy.intercept("GET", "/project/*/construction/development/unit/*").as(
      "getUnit"
    );
    cy.intercept("POST", "/project/*/construction/development/unit").as(
      "postUnit"
    );

    cy.wait("@getUnit");

    testingFilter(
      "Blok A1",
      "Blok A1",
      "24/66 Standar",
      "24/66 Standar",
      "Cluster Alamanda",
      "Cluster Alamanda",
      "PT DKU",
      "PT DKU",
      "Tersedia",
      "Tersedia",
      "Belum dimulai",
      "Belum dimulai"
    );
  });
});

function createDataUnit(tahap, cluster, blok, tipeUnit, start, end) {
  cy.contains("Unit").click();
  cy.contains("Tambah Unit").click();
  cy.get('[placeholder="Pilih Tahap"]').click();
  cy.contains(tahap).click();
  cy.get('[placeholder="Pilih Cluster"]').click();
  cy.contains(cluster).click();
  cy.get('[placeholder="Pilih Blok"]').click();
  cy.contains(blok).click();
  cy.get('[placeholder="Pilih Tipe"]').click();
  cy.contains(tipeUnit).click();
  cy.get('input[name="startUnit"]').type(start);
  if (end) {
    cy.get('input[name="endUnit"]').type(end);
  }
  cy.contains("Selanjutnya").click();
}

function createDuplicateUnit(tahap, cluster, blok, tipeUnit, start, end) {
  cy.contains("Unit").click();
  cy.contains("Tambah Unit").click();
  cy.get('[placeholder="Pilih Tahap"]').click();
  cy.contains(tahap).click();
  cy.get('[placeholder="Pilih Cluster"]').click();
  cy.contains(cluster).click();
  cy.get('[placeholder="Pilih Blok"]').click();
  cy.contains(blok).click();
  cy.get('[placeholder="Pilih Tipe"]').click();
  cy.contains(tipeUnit).click();
  cy.get('input[name="startUnit"]').type(start);
  if (end) {
    cy.get('input[name="endUnit"]').type(end);
  }
  cy.contains("Selanjutnya").click();
  const regexPesanError =
    /Anda tidak dapat menambahkan unit .* .* .* .* pada .* karena unit tersebut sudah terdaftar/;
  cy.contains(regexPesanError).should("exist");
  cy.wait(2000);
  cy.get("body").click(0, 0);
}

function createRabNewPekerjaan(params) {
  const {
    job,
    jobItem,
    uom,
    volume,
    material,
    uom1,
    volume1,
    price,
    uom2,
    volume2,
    price1,
    manPower,
    desc,
  } = params;

  cy.contains("RAB Unit").click();
  cy.contains("Edit").click();
  cy.contains("button", "Pekerjaan").click();
  cy.get('input[name="jobs.1.name"]').type(job);
  cy.get('input[name="jobs.1.jobItems.0.name"]').type(jobItem);
  cy.get('[data-cy="autocomplate-jobs-1-jobItems-0-uom"]').click();
  cy.contains(uom).click();
  cy.wait(2000);
  cy.get('input[name="jobs.1.jobItems.0.volume"]').type(100);
  cy.get('[data-cy="autocomplate-jobs-1-jobItems-0-materials-0-name"]').click();
  cy.wait(1000);
  cy.contains(material).click();
  cy.get('[data-cy="autocomplate-jobs-1-jobItems-0-materials-0-uom"]').click();
  cy.contains(uom1).click();
  cy.get('input[name="jobs.1.jobItems.0.materials.0.volume"]').type(volume1);
  cy.get('input[name="jobs.1.jobItems.0.materials.0.unitPrice"]').type(price);
  cy.get('[data-cy="autocomplate-jobs-1-jobItems-0-manPower-0-name"]').click();
  cy.contains(manPower).click();
  cy.get('[data-cy="autocomplate-jobs-1-jobItems-0-manPower-0-uom"]').click();
  cy.contains(uom2).click();
  cy.get('input[name="jobs.1.jobItems.0.manPower.0.volume"]').type(volume2);
  cy.get('input[name="jobs.1.jobItems.0.manPower.0.unitPrice"]').type(price1);
  cy.get('[name="description"]').type(desc);
  cy.contains("Simpan").click();
  cy.wait(2000);
  // cy.contains("button", "Simpan").click();
  // cy.get("#\\:r48\\:").should("be.visible").click();
  // cy.contains("Selesai").click();
  // cy.wait(2000);
  cy.get('[data-cy="right-button-confirmation"]').should("be.visible").click();
}

function testingFilter(
  filterCariBlok,
  filterBlok,
  filterCariTipeUnit,
  filterTipeUnit,
  filterCariCluster,
  filterCluster,
  filterCariKontraktor,
  filterKontraktor,
  filterCariStatusPenjualan,
  filterStatusPenjualan,
  filterCariProgressPembangunan,
  filterProgressPembangunan
) {
  cy.get('[data-cy="button-filter"]').click();
  cy.wait(2000);
  //Blok
  cy.get('[data-cy="filter-Blok"]').click();
  cy.get('input[placeholder="Cari Blok"]').type(filterCariBlok);
  cy.wait(2000);
  cy.contains(filterBlok).click();
  cy.get("body").click(0, 0);
  //Tipe unit
  cy.get('[data-cy="filter-Tipe Unit"]').click();
  cy.get('input[placeholder="Cari Tipe Unit"]').type(filterCariTipeUnit);
  cy.wait(2000);
  cy.get("//div/li").click();
  cy.get("body").click(0, 0);
  //Cluster
  cy.get('[data-cy="filter-Cluster"]').click();
  cy.contains(filterCluster).click();

  cy.get('[data-cy="filter-Kontraktor"]').click(); //kontraktor
  cy.contains(filterKontraktor).click();
  cy.get('[data-cy="filter-Status Penjualan"]').click(); //status penjualan
  cy.contains(filterStatusPenjualan).click();
  cy.get('[data-cy="filter-Progress Pembangunan"]').click(); //progress pembangunan
  cy.contains(filterProgressPembangunan).click();
  cy.contains("Simpan").click().click();
  cy.wait(2000);
}
