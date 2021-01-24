import React from "react";
import Price from "./Price";
import {render} from "test-utils";

describe("displaying the price of products", () => {
  it("shows a formated price for 1 product", () => {
    const {getByText} = render(<Price products={[{price: 11}]} />);
    expect(getByText("€0.11")).toBeVisible();
  });

  it("shows a formated price for multiple product", () => {
    const {getByText} = render(
      <Price products={[{price: 11}, {price: 11}, {price: 11}]} />
    );
    expect(getByText("€0.33")).toBeVisible();
  });
});
