import React from "react";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import Authentication from "./index";
import api from "./../../../api";
import {TYPES} from "./../../../actions";
import moxios from "moxios";
import {render, fireEvent, flushAllPromises} from "test-utils";
import {act} from "react-dom/test-utils";
import {push} from "connected-react-router";

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

    const {getByRole} = render(
      <Provider store={store}>
        <Authentication />
      </Provider>
    );

    expect(getByRole("heading")).toHaveTextContent("Authenticate Plus One");
    expect(getByRole("button")).toHaveTextContent("Authenticate");
  });

  it("authenticates the plus one system", async () => {
    const store = mockStore({
      authentication: {token: null, request: false},
    });
    const token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MjI1OTE3MDIsImV4cCI6MTU1NDEyNzcwMiwicGx1cy1vbmUiOnRydWV9._KlpRSqK7AHgYX4WybMPJlTazuoU4OY1KoEyQtkiTd4";

    moxios.stubRequest(`${base_api}/authenticate`, {
      response: {token},
      headers: {"content-type": "application/json"},
    });

    const {getByText, getByPlaceholderText} = render(
      <Provider store={store}>
        <Authentication />
      </Provider>
    );

    fireEvent.change(getByPlaceholderText("Passphrase"), {
      target: {value: "some long passphrase"},
    });
    fireEvent.submit(getByText("Authenticate"));

    await act(async () => {
      await flushAllPromises();
    });

    expect(store.getActions()).toEqual([
      {
        type: TYPES.AUTHENTICATE_REQUEST,
        password: "some long passphrase",
      },
      {type: TYPES.AUTHENTICATE_SUCCESS, token},
      {type: TYPES.LOAD_APPLICATION_REQUEST},
      push("/loading"),
      {type: TYPES.FETCH_MEMBERS_REQUEST},
      {type: TYPES.FETCH_PRODUCTS_REQUEST},
      {type: TYPES.FETCH_BOARD_MEMBERS_REQUEST},
      {type: TYPES.FETCH_COMMITTEE_MEMBERS_REQUEST},
      {type: TYPES.FETCH_STATISTICS_REQUEST},
      {type: TYPES.FETCH_ACTIVITIES_REQUEST},
    ]);
  });
});