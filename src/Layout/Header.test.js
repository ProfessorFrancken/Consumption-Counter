import React from "react";
import ReactDOM from "react-dom";
import {MemoryRouter} from "react-router-dom";
import {Provider} from "react-redux";
import Header from "./Header";
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
