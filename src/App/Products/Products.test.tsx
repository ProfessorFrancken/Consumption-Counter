import React from "react";
import {render, fireEvent} from "test-utils";
import {AvailableProduct} from "./OrdersContext";
import Products from "./Products";

it("renders without crashing", () => {
  const addToOrder = jest.fn();
  render(
    <Products
      products={{Bier: [], Fris: [], Eten: []}}
      addProductToOrder={addToOrder}
      addProductToOrderOrMakeOrder={addToOrder}
    />
  );
});

it("adds products to an order when clicked", async () => {
  const addToOrder = jest.fn();

  const hertogJan: AvailableProduct = {
    id: 1,
    name: "Hertog-Jan",
    image: "",
    age_restriction: 18,
    category: "Bier",
    locked: false,
    ordered: 0,
    position: 0,
    price: 1,
    splash_image: "",
  };

  const products = (
    <Products
      products={{
        Bier: [hertogJan],
        Fris: [],
        Eten: [],
      }}
      addProductToOrder={addToOrder}
      addProductToOrderOrMakeOrder={addToOrder}
    />
  );

  const screen = render(products);

  // Since this component uses a long press event, we need to simulate mouse down and up
  fireEvent.mouseDown(screen.getByLabelText("Buy Hertog-Jan"));
  fireEvent.mouseUp(screen.getByLabelText("Buy Hertog-Jan"));

  expect(addToOrder).toBeCalledWith(hertogJan);
});
