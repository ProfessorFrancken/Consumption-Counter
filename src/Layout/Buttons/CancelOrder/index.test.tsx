import React from "react";
import CancelOrder from ".";
import {fireEvent, render} from "test-utils";

afterEach(() => {
  localStorage.removeItem("plus_one_order_queue");
});

describe("<CancelOrder>", () => {
  it("cancels orders", () => {
    const member = {id: 2, firstName: "John", surname: "Snow"};
    const products = [{id: 1, price: 100, name: "Pils"}];
    const storeState = {
      queuedOrder: {
        order: {products, member, ordered_at: 1},
        ordered_at: 1,
      },
    };
    const {getByRole, queryByRole} = render(<CancelOrder />, {storeState});

    expect(getByRole("button")).toHaveTextContent("Cancel buying Pils for €1.00");
    fireEvent.click(getByRole("button"));
    expect(queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not show all products when buying multiple products", () => {
    const member = {id: 2, firstName: "John", surname: "Snow"};
    const products = [
      {id: 1, price: 100, name: "Pils"},
      {id: 2, price: 100, name: "Kinder bueno"},
    ];
    const storeState = {
      queuedOrder: {
        order: {products, member, ordered_at: 1},
        ordered_at: 1,
      },
    };
    const {getByRole, queryByRole} = render(<CancelOrder />, {storeState});

    expect(getByRole("button")).toHaveTextContent(
      "Cancel buying multiple products for €2.00"
    );

    fireEvent.click(getByRole("button"));

    expect(queryByRole("button")).not.toBeInTheDocument();
  });

  it("isn't shown when no order is queud", () => {
    const storeState = {queuedOrder: null};

    const {queryByRole} = render(<CancelOrder />, {storeState});

    expect(queryByRole("button")).toBeNull();
  });
});
