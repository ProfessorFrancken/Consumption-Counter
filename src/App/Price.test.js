import React from "react";
import Price from "./Price";
import {mount} from "enzyme";

describe("displaying the price of products", () => {
  it("shows a formated price for 1 product", () => {
    const price = mount(<Price products={[{price: 11}]} />);
    expect(price.text()).toEqual("€0.11");
  });

  it("shows a formated price for multiple product", () => {
    const price = mount(<Price products={[{price: 11}, {price: 11}, {price: 11}]} />);
    expect(price.text()).toEqual("€0.33");
  });
});
