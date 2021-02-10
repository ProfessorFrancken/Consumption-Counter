/* eslint-disable no-undef */
import {makeServer} from "../../src/server/index";

const member = {
  firstName: "John",
  lastName: "Snow",
  fullName: "John SNow",
};

let server;
beforeEach(() => {
  server = makeServer({environment: "test"});
  server.create("member", {
    latest_purchase_at: "2020-03-08 22:05:49",
    geboortedatum: "1993-04-26",
    achternaam: member.lastName,
    voornaam: member.firstName,
    tussenvoegsel: "",
    bijnaam: "",
  });
});

afterEach(() => {
  server.shutdown();
});

describe("Authentication", () => {
  it("Authenticates with the Consumption Counter API", () => {
    expect(localStorage.getItem("plus_one_authorization")).to.be.null;
    const password = "bitterballen";

    cy.visit("/");

    cy.findByPlaceholderText("Passphrase").type(password);
    cy.findByRole("button", {name: /Authenticat/i})
      .click()
      .should(() => {
        const encoded_token = localStorage.getItem("plus_one_authorization");
        expect(encoded_token).to.not.be.null;

        const token = JSON.parse(encoded_token);
        expect(token).to.not.be.null;
      });

    cy.location("pathname").should("eq", "/loading");
    cy.findByText("Loading", {exact: false});
    cy.findByRole("link", {name: /Open application/}).click();

    cy.location("pathname").should("eq", "/");
    cy.findByText(member.lastName, {exact: false});

    cy.visit("/settings");
    cy.findByRole("button", {name: /Refresh token/});
  });
});
