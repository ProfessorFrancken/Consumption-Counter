import React from "react";
import ReactDOM from "react-dom";
import {mount} from "enzyme";
import Products from "./Products";

it("renders without crashing", () => {
  const div = document.createElement("div");

  ReactDOM.render(
    <Products
      products={{Bier: [], Fris: [], Eten: []}}
      addProductToOrder={(click) => click}
    />,
    div
  );
});

it("adds products to an order when clicked", () => {
  const addToOrder = jest.fn();

  const products = (
    <Products
      products={{
        Bier: [{id: 1, name: "Hertog-Jan", image: ""}],
        Fris: [],
        Eten: [],
      }}
      addProductToOrder={addToOrder}
    />
  );

  mount(products).find("Product").simulate("mouseDown").simulate("mouseUp");

  expect(addToOrder).toBeCalledWith({id: 1, name: "Hertog-Jan", image: ""});
});

xit("renders products from beer, drinks and food categories", () => {
  const products = (
    <Products
      products={{
        Bier: [{id: 1, name: "Hertog-Jan", image: "", age_restriction: 0}],
        Fris: [],
        Eten: [],
      }}
      addProductToOrder={jest.fn()}
    />
  );

  expect(products).toMatchSnapshot();
});
