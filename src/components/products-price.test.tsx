import {screen} from "@testing-library/react";
import ProductsPrice from "./products-price";
import {render} from "../test-utils";

describe("displaying the price of products", () => {
  it("shows a formated price for 1 product", () => {
    render(<ProductsPrice products={[{price: 11}]} />);
    expect(screen.getByText("€0.11")).toBeVisible();
  });

  it("shows a formated price for multiple product", () => {
    render(<ProductsPrice products={[{price: 11}, {price: 11}, {price: 11}]} />);

    expect(screen.getByText("€0.33")).toBeVisible();
  });
});
