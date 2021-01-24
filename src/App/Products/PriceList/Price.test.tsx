import React from "react";
import Price from "./Price";
import {render} from "test-utils";

it("shows a formated price of a product", () => {
  const {getByText} = render(<Price price={11} />);
  expect(getByText("€0.11")).toBeVisible();
});
