import React from "react";
import Authentication from "./index";
import {render, fireEvent} from "test-utils";
import {setupServer} from "msw/lib/node";
import {rest} from "msw";

describe("Authentication", () => {
  beforeEach(() => {
    localStorage.removeItem("plus_one_authorization");
  });

  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MjI1OTE3MDIsImV4cCI6MTU1NDEyNzcwMiwicGx1cy1vbmUiOnRydWV9._KlpRSqK7AHgYX4WybMPJlTazuoU4OY1KoEyQtkiTd4";

  const server = setupServer(
    rest.post("*/authenticate", (req, res, ctx) => {
      return res(ctx.json({token}));
    })
  );

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it("Shows a warning that the system is not authenticated", () => {
    const {getByRole, getByText} = render(<Authentication />, {
      storeState: {authentication: {token: null}},
    });

    expect(
      getByText(
        "You need to authenticate with our server in order to connect the Consumption Counter."
      )
    ).toBeInTheDocument();
    expect(getByRole("button")).toHaveTextContent("Authenticate");
  });

  it("authenticates the plus one system", async () => {
    const {getByText, findByText, getByPlaceholderText} = render(<Authentication />, {
      storeState: {authentication: {token: null}},
    });

    fireEvent.change(getByPlaceholderText("Passphrase"), {
      target: {value: "some long passphrase"},
    });
    fireEvent.submit(getByText("Authenticate"));

    expect(
      await findByText("The system is authentiated until", {exact: false})
    ).toBeInTheDocument();
  });
});
