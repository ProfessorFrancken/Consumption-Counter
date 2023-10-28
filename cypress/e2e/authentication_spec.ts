import {mswHandlers} from "../support/msw-handlers";

beforeEach(() => {
  cy.interceptRequest(...mswHandlers);
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

    cy.findByRole("heading", {
      level: 2,
      name: "T.F.V. 'Professor Francken'",
    }).click();

    cy.visit("/settings");
    cy.findByRole("button", {name: /Refresh token/});
  });
});
