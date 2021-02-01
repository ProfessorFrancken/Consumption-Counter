import React from "react";
import Authentication from "./index";
import moxios from "moxios";
import {render, fireEvent} from "test-utils";
import {deleteFromStorage} from "@rehooks/local-storage";

describe("Authentication", () => {
  const base_api = process.env.REACT_APP_API_SERVER;

  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it("Shows a warning that the system is not authenticated", () => {
    deleteFromStorage("plus_one_authorization");
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
    deleteFromStorage("plus_one_authorization");
    const token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MjI1OTE3MDIsImV4cCI6MTU1NDEyNzcwMiwicGx1cy1vbmUiOnRydWV9._KlpRSqK7AHgYX4WybMPJlTazuoU4OY1KoEyQtkiTd4";

    moxios.stubRequest(`${base_api}/authenticate`, {
      response: {token},
      headers: {"content-type": "application/json"},
    });

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
