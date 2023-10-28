/* eslint-disable no-undef */
import {association} from "miragejs";
import {makeServer} from "../../src/test-utils/server/index";
import {TIME_TO_CANCEL} from "./../../src/components/orders/queued-orders-context";
import {SCREEN_SAVER_TIMEOUT} from "./../../src/components/redirect-when-idle";
import moment from "moment";

const member = {
  firstName: "John",
  lastName: "Snow",
  fullName: "John Snow",
};

const thisWeek = [
  // The previous Sunday isn't displayed
  new Date(2020, 2, 8),

  // Start at Monday
  new Date(2020, 2, 9),
  new Date(2020, 2, 10),
  new Date(2020, 2, 11),
  // Up to Thursday
  new Date(2020, 2, 12),
];

let server;
beforeEach(() => {
  server = makeServer({environment: "test"});
  server.logging = true;
  const date = new Date();
  server.create("member", {
    latest_purchase_at: date.toISOString(),
    geboortedatum: "1993-04-26",
    achternaam: member.lastName,
    voornaam: member.firstName,
    tussenvoegsel: "",
    bijnaam: "",
  });

  server.create("member", {
    id: 1403,
    latest_purchase_at: date.toISOString(),
    geboortedatum: "1993-04-26",
    achternaam: "Redeman",
    voornaam: "Mark",
    tussenvoegsel: "",
    bijnaam: "",
  });

  server.create("product", {
    categorie: "Bier",
    naam: "Hertog Jan",
  });

  server.create("product", {
    categorie: "Eten",
    naam: "Mars",
  });

  server.create("product", {
    categorie: "Fris",
    naam: "Ice Tea",
    prijs: "0.6100",
  });

  server.create("product", {
    categorie: "Fris",
    naam: "Goede morgen!",
  });

  server.create("product", {
    categorie: "Fris",
    naam: "Pepsi max",
    splash_afbeelding:
      "https://old.professorfrancken.nl/database/streep/afbeeldingen/ECDOccDsQVmRRRpyBnN1.jpeg",
  });

  server.create("member", {
    achternaam: "Sjaars",
    voornaam: "Sjaars",
    tussenvoegsel: "",
    bijnaam: "Sjaars",
    geboortedatum: "2003-01-01",
  });

  server.create("committeeMember", {
    committee: association({
      id: 1,
      name: "s[ck]rip(t|t?c)ie",
    }),
    member: association({
      id: 33,
      latest_purchase_at: "2020-03-08 22:05:49",
      geboortedatum: "1993-04-26",
      achternaam: "Baars",
      voornaam: "Sven",
      tussenvoegsel: "",
      bijnaam: "ir. Sven",
    }),
    year: new Date().getFullYear(),
  });

  server.create("committeeMember", {
    committee: association({
      id: 1,
      name: "s[ck]rip(t|t?c)ie",
    }),
    member: association({
      id: 1403,
      latest_purchase_at: "2020-03-08 22:05:49",
      geboortedatum: "1993-04-26",
      achternaam: "Redeman",
      voornaam: "Mark",
      tussenvoegsel: "",
      bijnaam: "",
    }),
    year: new Date().getFullYear(),
  });

  server.create("boardMember", {
    board: association({
      year: 2019,
    }),
    member: association({
      bijnaam: "Dictadtor",
      afbeelding:
        "https://old.professorfrancken.nl/database/streep/afbeeldingen/nc1J3sNtthqGkeQy0tDf.jpeg",
    }),
  });

  server.create("member", {
    achternaam: "Stark",
    voornaam: "Arya",
    tussenvoegsel: "",
    bijnaam: "Arya",
    button_width: 70,
    button_height: 40,
    latest_purchase_at: "2020-03-08 22:05:49",
    geboortedatum: "1993-04-26",
  });

  thisWeek.forEach((day, idx) => {
    server.create("category", {
      date: moment(day).format("YYYY-MM-DD"),
      beer: 100 * (idx + 1),
    });
  });
});

afterEach(() => {
  server.shutdown();
});

describe("Francken Consumption Counter", () => {
  describe("Striping soda & food", () => {
    it("Allows striping soda", () => {
      cy.login();
      cy.get(".tilesGrid").should("not.be.empty");

      cy.get(".tilesGrid > :nth-child(1)").click();
      // cy.get(".tilesGrid").should("contain", member.fullName);
      cy.findByText(member.fullName).click();

      cy.get(".titleName > span").should("contain", member.fullName);
      cy.get(".productsGrid > :nth-child(2)").should("contain", "Ice Tea");
      cy.get(".productsGrid > :nth-child(2) > :nth-child(1)").should(
        "contain",
        "Ice Tea"
      );
      cy.get(".productsGrid > :nth-child(2) > :nth-child(1)").click();
      cy.get('.cancelButton > [style="margin-left: 0.5em;"]').should(
        "contain",
        "Cancel buying Ice Tea for "
      );
      cy.get(".backButton > span").should("contain", member.fullName);
    });

    it("Buying two products using the back button", () => {
      cy.login();
      cy.get(".tilesGrid").should("not.be.empty");

      cy.get(".tilesGrid > :nth-child(1)").click();
      cy.get(".tilesGrid").should("contain", member.fullName);
      cy.findByText(member.fullName).click();
      cy.get(".titleName > span").should("contain", member.fullName);
      cy.get(".productsGrid > :nth-child(2)").should("contain", "Ice Tea");
      cy.get(".productsGrid > :nth-child(2) > :nth-child(1)").should(
        "contain",
        "Ice Tea"
      );
      cy.get(".productsGrid > :nth-child(2) > :nth-child(1)").click();
      cy.get('.cancelButton > [style="margin-left: 0.5em;"]').should(
        "contain",
        "Cancel buying Ice Tea for "
      );
      cy.get(".backButton > span").click();
      cy.get(".productsGrid > :nth-child(3) > :nth-child(1)").click();
      cy.get('.cancelButton > [style="margin-left: 0.5em;"]').should(
        "contain",
        "Cancel buying Mars for "
      );
    });

    it("Showing prices of products", () => {
      cy.login();
      cy.get(".tilesGrid").should("not.be.empty");

      cy.get(".tilesGrid > :nth-child(1)").click();
      cy.get(".tilesGrid").should("contain", member.fullName);
      cy.findByText(member.fullName).click();
      cy.get(".titleName > span").should("contain", member.fullName);
      cy.get(".productsGrid > :nth-child(2)").should("contain", "Ice Tea");
      cy.get(".productsGrid > :nth-child(2) > :nth-child(1)").should(
        "contain",
        "Ice Tea"
      );

      cy.contains("Show prices").click();
      cy.get(".productsGrid > :nth-child(2) > :nth-child(1)").should("contain", "0.61");

      cy.contains("Buy products").click();
      cy.get(".productsGrid > :nth-child(2) > :nth-child(1)").should(
        "contain",
        "Ice Tea"
      );
    });

    it("Allows buying multiple products at once", () => {
      cy.login();
      cy.get(".tilesGrid").should("not.be.empty");

      cy.get(".tilesGrid > :nth-child(1)").click();
      cy.get(".tilesGrid").should("contain", member.fullName);
      cy.findByText(member.fullName).click();
      cy.get(".titleName > span").should("contain", member.fullName);
      cy.get(".productsGrid > :nth-child(2)").should("contain", "Ice Tea");
      cy.get(".productsGrid > :nth-child(2) > :nth-child(1)")
        .should("contain", "Ice Tea")
        .trigger("mousedown");

      cy.findByText("Buy it all", {exact: false});
      cy.get(".productsGrid > :nth-child(2) > :nth-child(1)")
        .should("contain", "1")
        .click()
        .click()
        .should("contain", "3");

      cy.get(".productsGrid > :nth-child(3) > :nth-child(1)")
        .click()
        .should("contain", "1");

      cy.get(".buyAllButton").should("contain", "Buy it all!");

      cy.get(".buyAllButton").click();

      cy.get(".cancelButton").should("contain", "Cancel buying multiple products");
    });

    it("Shows a warning when selecting an inactive member", () => {
      const past = new Date();
      past.setYear(past.getFullYear() - 1);
      server.create("member", {
        latest_purchase_at: past.toISOString(),
        geboortedatum: "1993-01-01",
        achternaam: "Stark",
        voornaam: "Brandon",
        tussenvoegsel: "",
        bijnaam: "Brandon Stark",
      });

      const stub = cy.stub();
      stub.onFirstCall().returns(false);
      cy.on("window:confirm", stub);

      cy.login();

      cy.get(".tilesGrid").should("not.be.empty");

      cy.get(`.tilesGrid > :nth-child(1)`).click();

      cy.findByText("Brandon Stark")
        .click()
        .then(() => {
          expect(stub.getCall(0)).to.be.calledWith(
            `Are you sure you want to select Brandon Stark?`
          );
          cy.get(".tilesGrid").should("contain", "Brandon Stark");
        });
    });

    it("Allows selecting an inactive member after confirmation", () => {
      const past = new Date();
      past.setYear(past.getFullYear() - 1);
      server.create("member", {
        latest_purchase_at: past.toISOString(),
        geboortedatum: "1993-01-01",
        achternaam: "Stark",
        voornaam: "Brandon",
        tussenvoegsel: "",
        bijnaam: "Brandon Stark",
      });

      const stub = cy.stub();
      stub.onFirstCall().returns(true);
      cy.on("window:confirm", stub);

      cy.login();

      cy.get(".tilesGrid").should("not.be.empty");

      cy.get(`.tilesGrid > :nth-child(1)`).click();
      cy.findByText("Brandon Stark")
        .click()
        .then(() => {
          expect(stub.getCall(0)).to.be.calledWith(
            `Are you sure you want to select Brandon Stark?`
          );
          cy.get(".titleName > span").should("contain", "Brandon Stark");
          cy.location("pathname").should("eq", "/products");
        });
    });
  });

  describe("Prominent", () => {
    it("Buying via prominent", () => {
      server.create("boardMember", {
        board: association({
          year: 2017,
        }),
        member: association({
          id: 1403,
          latest_purchase_at: "2020-03-08 22:05:49",
          geboortedatum: "1993-04-26",
          achternaam: "Redeman",
          voornaam: "Mark",
          tussenvoegsel: "",
          bijnaam: "",
        }),
      });
      cy.login();

      cy.get('[href="/prominent"]').click();
      cy.get(".boardsRow > :nth-child(1) > :nth-child(1)")
        .should("contain", "Mark Redeman")
        .click();

      cy.get(".titleName > span").should("contain", "Mark Redeman");
      cy.get(".productsGrid > :nth-child(2) > :nth-child(1)").click();
      cy.get('.cancelButton > [style="margin-left: 0.5em;"]').should(
        "contain",
        "Cancel buying Ice Tea for "
      );
    });

    it("Board member from 5 years ago", () => {
      const date = new Date();

      server.create("boardMember", {
        board: association({
          year: date.getFullYear() - 6,
        }),
        member: association({
          id: 9999,
          latest_purchase_at: date.toISOString(),
          achternaam: "Stark",
          voornaam: "Rickard",
          tussenvoegsel: "",
          bijnaam: "Rickard Stark",
        }),
      });
      server.createList("boardMember", 5, {
        board: association({year: date.getFullYear()}),
      });
      server.createList("boardMember", 5, {
        board: association({year: date.getFullYear() - 1}),
      });
      server.createList("boardMember", 5, {
        board: association({year: date.getFullYear() - 2}),
      });
      server.createList("boardMember", 5, {
        board: association({year: date.getFullYear() - 3}),
      });
      server.createList("boardMember", 5, {
        board: association({year: date.getFullYear() - 4}),
      });
      cy.login();

      cy.get('[href="/prominent"]').click();
      cy.get(".prominentRow > .tile").should("contain", "Rickard Stark");
    });
  });

  describe("Recent", () => {
    it("Shows members that recently bought a product", () => {
      cy.login();

      // Mock clock so that we don't have to wait for the orders to be submitted
      cy.clock();

      cy.selectMember({name: member.fullName});
      cy.buyIceTea();
      cy.tick(TIME_TO_CANCEL);

      cy.selectMember({
        nthSurname: 1,
        nthFirstname: 2,
        name: "Arya",
      });
      cy.buyIceTea();
      cy.tick(TIME_TO_CANCEL);

      cy.get('[href="/recent"]').click();
      cy.tick(TIME_TO_CANCEL);

      // Due to some weird issue with mocking the time we need to force the page to reload
      cy.get('[href="/prominent"]').click();
      cy.get('[href="/recent"]').click();

      cy.get(".titleName > span").should("contain", "Recent");
      cy.get(".tilesGrid > :nth-child(2)").should("contain", member.fullName);
      cy.get(".tilesGrid > :nth-child(1)").should("contain", "Arya");
    });
  });

  describe("Present", () => {
    it("People currently at Francken", () => {
      cy.login();
      cy.get('[href="/present"]').click();
      cy.get(".tilesGrid").should("contain", "Mark Redeman");
    });
  });

  describe("Commitees", () => {
    it("Allows selecting a member via committees", () => {
      cy.login();

      cy.get('[href="/committees"]').click();
      cy.get(".titleName > span").should("contain", "Committees");

      cy.get(".tilesGrid > :nth-child(1)").should("contain", "s[ck]rip(t|t?c)ie").click();
      cy.get(".titleName > span").should("contain", "s[ck]rip(t|t?c)ie");

      cy.get(".tilesGrid").should("contain", "Mark Redeman");
      cy.get(".tilesGrid > :nth-child(2)").click();
      cy.get(".titleName > span").should("contain", "Mark Redeman");
    });
  });

  describe("Compucie", () => {
    beforeEach(() => {
      cy.login();
    });

    it("Shows all previous compucie members", () => {
      cy.get(".association").click();
      cy.get(".compucie").should("contain", "ir. Sven");
      cy.get(".compucie-buttons").should("contain", "Refresh");
      cy.get(".compucie-buttons").should("contain", "Guest");
      cy.get(".compucie-buttons").should("contain", "Overdue");
    });

    it("Can be used to go to the settings page", () => {
      cy.get(".association").click();
      cy.get('[href="/settings"]').click();

      cy.location("pathname").should("eq", "/settings");
      cy.get(".content").should("contain", "Queued Orders");
      cy.findByRole("button", {name: /Refresh token/});
    });

    describe("The settings page", () => {
      it("Can be used to see the queued orders", () => {
        cy.selectMember({name: member.fullName});
        cy.buyIceTea();
        cy.visit("/settings");
        cy.get("tbody > tr").should("contain", member.fullName);
        cy.get("tbody > tr").should("contain", "Ice Tea");
        cy.get("tbody > tr").should("contain", "queued");
        cy.get("tbody > tr").should("contain", "Retry now");
        cy.get("tbody > tr").should("contain", "Cancel");
      });

      it("Allows cancelling a queued order", () => {
        cy.selectMember({name: member.fullName});
        cy.buyIceTea();
        cy.visit("/settings");

        cy.get("tbody")
          .find("tr")
          .then((oldQueuedOrders) => {
            cy.get("tbody > tr:first() .text-danger").should("contain", "Cancel").click();

            cy.get("tbody")
              .find("tr")
              .should("have.length", Cypress.$(oldQueuedOrders).length - 1);
          });
      });
    });
  });

  describe("Statistics", () => {
    it("Shows the latest purchases", () => {
      cy.login();
      // Mock clock so that we don't have to wait for the orders to be submitted
      cy.clock();
      [2, 3].forEach((category) => {
        cy.selectMember({name: member.fullName});
        cy.get(`.productsGrid > :nth-child(${category}) > :nth-child(1)`).click();
        cy.tick(TIME_TO_CANCEL);
      });

      cy.selectMember({name: member.fullName});
      cy.tick(TIME_TO_CANCEL);

      cy.get('[href="/statistics"]').click();
      cy.get(".titleName > span").should("contain", "Statistics");

      cy.get(".recent-orders").find(".recent-order").should("have.length", 2);
      cy.get(".recent-orders")
        .find(".recent-order")
        .then((orders) => {
          cy.wrap(Cypress.$(orders[0])).should("contain", `bought by ${member.fullName}`);
          cy.wrap(Cypress.$(orders[1])).should("contain", `bought by ${member.fullName}`);

          cy.wrap(Cypress.$(orders[0])).should("contain", "Mars");
          cy.wrap(Cypress.$(orders[1])).should("contain", "Ice Tea");
        });
    });

    it("Shows the purchases from last week", () => {
      cy.login();

      cy.clock(thisWeek[4].getTime(), ["Date"]);

      cy.get('[href="/statistics"]').click();
      cy.get(".titleName > span").should("contain", "Statistics");
      cy.get(
        ':nth-child(2) > .p-0 > [style="position: absolute; top: 1em; right: 1em; z-index: 100; text-align: right;"] > .mb-1'
      ).should("contain", "1400");
      cy.get(
        ':nth-child(2) > .p-0 > [style="position: absolute; top: 1em; right: 1em; z-index: 100; text-align: right;"] > .text-uppercase'
      ).should("contain", "500");
    });

    it("Shows a heatmap of busy days", () => {
      cy.login();

      cy.get('[href="/statistics"]').click();
      cy.get(".titleName > span").should("contain", "Statistics");
    });
  });

  describe("Screensaver / Bug free zone", () => {
    it("Goes to home after a long idle time", () => {
      cy.login();

      // Mock clock so that we don't have to wait for the screensaver
      cy.clock();

      cy.selectMember({name: member.fullName});

      // Should go back to the members page
      cy.tick(SCREEN_SAVER_TIMEOUT * 1);
      cy.location("pathname").should("eq", "/");

      // Should go to the statistics page after a long wait
      // TODO: It's unclear why but tick does not seem to work while testing the screensaver
      // cy.tick(SCREEN_SAVER_TIMEOUT * 2);
      cy.wait(SCREEN_SAVER_TIMEOUT * 2);
      cy.location("pathname").should("eq", "/statistics");
    });
  });

  describe("Easter eggs", () => {
    it("Shows a background of a product", () => {
      cy.login();

      cy.selectMember({name: member.fullName});

      cy.get(".productsGrid > :nth-child(2) > :nth-child(3)").should(
        "contain",
        "Pepsi max"
      );
      cy.get(".productsGrid > :nth-child(2) > :nth-child(3)").click();
      cy.get(".wrapper").should(
        "have.css",
        "background-image",
        'url("https://old.professorfrancken.nl/database/streep/afbeeldingen/ECDOccDsQVmRRRpyBnN1.jpeg")'
      );
    });

    it("Shows a small member button", () => {
      cy.login();

      cy.get(`.tilesGrid > :nth-child(1)`).click();
      cy.get(".tilesGrid").should("contain", "Arya");

      const arya = cy
        .findByRole("button", {name: "Arya Stark"})
        .should("contain", "Arya")
        .should("have.css", "transform", "matrix(0.5, 0, 0, 0.5, 0, 0)");
    });

    it("Shows a member button with background", () => {
      cy.login();

      cy.get('[href="/prominent"]').click();
      const jeanne = cy.get(".boardsRow > :nth-child(1) > :nth-child(1)");
      jeanne.should("contain", "Dictadtor");
      jeanne.should(
        "have.css",
        "background-image",
        'url("https://old.professorfrancken.nl/database/streep/afbeeldingen/nc1J3sNtthqGkeQy0tDf.jpeg")'
      );
    });

    it("Locks goedemorgen after 12", () => {
      cy.login();

      const after12 = new Date(2020, 2, 2, 13).getTime();
      cy.clock(after12, ["Date"]);

      cy.selectMember({name: member.fullName});
      cy.get(".productsGrid > :nth-child(2) > :nth-child(2)")
        .should("contain", "Goede morgen")
        .should("have.class", "locked");
    });
  });

  describe("Sponsor opportunities", () => {
    it("Shows logos of companies sponsoring the system", () => {
      cy.login();
      cy.get(".tilesGrid").should("not.be.empty");

      cy.get(".company-logos").find("img").should("have.length", 3);
    });
  });

  describe("Drinking rules", () => {
    it("Does not allow striping beer before 4", () => {
      const before4 = new Date(2020, 2, 2, 13).getTime();
      cy.clock(before4, ["Date"]);
      cy.login();

      cy.selectMember({name: member.fullName});

      cy.get(".productsGrid > :nth-child(1) > :nth-child(1)").should(
        "have.class",
        "locked"
      );

      cy.get(".productsGrid > :nth-child(2) > :nth-child(1)").should(
        "not.have.class",
        "locked"
      );
      cy.get(".productsGrid > :nth-child(3) > :nth-child(1)").should(
        "not.have.class",
        "locked"
      );
    });

    it("Allows striping beer after 4", () => {
      const after4 = new Date(2020, 2, 2, 17).getTime();
      cy.clock(after4, ["Date"]);
      cy.login();

      cy.selectMember({name: member.fullName});

      cy.get(".productsGrid > :nth-child(1) > :nth-child(1)").should(
        "not.have.class",
        "locked"
      );

      cy.get(".productsGrid > :nth-child(2) > :nth-child(1)").should(
        "not.have.class",
        "locked"
      );
      cy.get(".productsGrid > :nth-child(3) > :nth-child(1)").should(
        "not.have.class",
        "locked"
      );
    });

    it(`A minor isn't allowed to buy alcohol`, () => {
      const after4 = new Date(2020, 2, 2, 17).getTime();
      cy.clock(after4, ["Date"]);
      cy.login();

      // Normally we should be able to see beer
      cy.selectMember({name: member.fullName});
      cy.get(".productsGrid").find("nav").should("have.length", 3);

      // But not if the member is a minor
      cy.get('[href="/"]').click();
      cy.selectMember({nthFirstname: 3, name: "Sjaars"});
      cy.get(".productsGrid").find("nav").should("have.length", 2);
    });
  });
});

describe("Reloading the application", () => {
  it("Reloads members when refreshing", () => {
    cy.login();
    cy.visit("/compucie");

    cy.findByRole("button", {name: /Refresh/}).click();
    cy.findByText("Loading", {exact: false});
    cy.findByRole("link", {name: /Open application/}).click();
  });

  it.skip("Shows a loading screen when refreshing the application");
});
