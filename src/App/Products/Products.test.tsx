import React from "react";
import {render, fireEvent} from "test-utils";
import Products from "./Products";

it("renders without crashing", () => {
  render(
    <Products
      products={{Bier: [], Fris: [], Eten: []}}
      addProductToOrder={(click) => click}
    />
  );
});

it("adds products to an order when clicked", async () => {
  const addToOrder = jest.fn();

  const products = (
    <Products
      products={{
        Bier: [{id: 1, name: "Hertog-Jan", image: ""}],
        Fris: [],
        Eten: [],
      }}
      addProductToOrderOrMakeOrder={addToOrder}
    />
  );

  const screen = render(products);

  // Since this component uses a long press event, we need to simulate mouse down and up
  fireEvent.mouseDown(screen.getByLabelText("Buy Hertog-Jan"));
  fireEvent.mouseUp(screen.getByLabelText("Buy Hertog-Jan"));

  expect(addToOrder).toBeCalledWith({id: 1, name: "Hertog-Jan", image: ""});
});
