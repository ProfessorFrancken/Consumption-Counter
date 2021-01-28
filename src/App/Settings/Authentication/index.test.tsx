import React from "react";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import Authentication from "./index";
import api from "./../../../api";
import moxios from "moxios";
import {render, fireEvent, flushAllPromises} from "test-utils";
import {act} from "react-dom/test-utils";

describe("Authentication", () => {
  const base_api = process.env.REACT_APP_API_SERVER;

  const middlewares = [thunk.withExtraArgument(api)];
  const mockStore = configureMockStore(middlewares);

  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it("Shows a warning that the system is not authenticated", () => {
    const store = mockStore({
      authentication: {token: null, request: false},
    });

    const {getByRole} = render(<Authentication />, {
      storeState: {authentication: {token: null}},
    });

    expect(getByRole("heading")).toHaveTextContent("Authenticate Plus One");
    expect(getByRole("button")).toHaveTextContent("Authenticate");
  });

  it("authenticates the plus one system", async () => {
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

    await act(async () => {
      await flushAllPromises();
    });

    expect(
      await findByText("The system is authentiated until", {exact: false})
    ).toBeInTheDocument();
  });
});
