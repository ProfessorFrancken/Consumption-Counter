import React from "react";
import ReactDOM from "react-dom";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import {MemoryRouter} from "react-router-dom";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import {Provider} from "react-redux";
import Header from "./Header";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'redu... Remove this comment to see the full error message
import configureMockStore from "redux-mock-store";
import {render} from "@testing-library/react";

it("renders a buy more button when visiting the products page", () => {
  const mockStore = configureMockStore([]);
  const store = mockStore({
    order: {buyMore: false, member: {fullname: "Mark Redeman"}},
    queuedOrder: null,
  });
  const {getByText} = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/products"]}>
        <Header />
      </MemoryRouter>
    </Provider>
  );

  expect(getByText("Show prices")).toBeDefined();
});
