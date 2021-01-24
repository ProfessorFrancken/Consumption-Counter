import React from "react";
import CancelOrder from ".";
import configureMockStore from "redux-mock-store";
import {TYPES} from "actions";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import {fireEvent, render} from "test-utils";

describe("<CancelOrder>", () => {
  it("cancels orders", () => {
    const mockStore = configureMockStore([thunk]);

    const member = {id: 2, firstName: "John", surname: "Snow"};
    const products = [{id: 1, price: 100, name: "Pils"}];
    const store = mockStore({
      queuedOrder: {
        order: {products, member, ordered_at: 1},
        ordered_at: 1,
      },
    });
    const {getByRole} = render(
      <Provider store={store}>
        <CancelOrder />
      </Provider>
    );

    fireEvent.click(getByRole("button"));
    expect(getByRole("button")).toHaveTextContent("Cancel buying Pils for €1.00");

    expect(store.getActions()).toEqual([
      {
        type: TYPES.CANCEL_ORDER,
        order: {products, member, ordered_at: 1},
      },
    ]);
  });

  it("does not show all products when buying multiple products", () => {
    const mockStore = configureMockStore([thunk]);

    const member = {id: 2, firstName: "John", surname: "Snow"};
    const products = [
      {id: 1, price: 100, name: "Pils"},
      {id: 2, price: 100, name: "Kinder bueno"},
    ];
    const store = mockStore({
      queuedOrder: {
        order: {products, member, ordered_at: 1},
        ordered_at: 1,
      },
    });
    const {getByRole} = render(
      <Provider store={store}>
        <CancelOrder />
      </Provider>
    );

    fireEvent.click(getByRole("button"));
    expect(getByRole("button")).toHaveTextContent(
      "Cancel buying multiple products for €2.00"
    );

    expect(store.getActions()).toEqual([
      {
        type: TYPES.CANCEL_ORDER,
        order: {products, member, ordered_at: 1},
      },
    ]);
  });

  it("isn't shown when no order is queud", () => {
    const mockStore = configureMockStore([thunk]);
    const store = mockStore({queuedOrder: null});
    const {queryByRole} = render(
      <Provider store={store}>
        <CancelOrder />
      </Provider>
    );

    expect(queryByRole("button")).toBeNull();
  });
});
