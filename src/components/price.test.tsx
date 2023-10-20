import {screen} from "@testing-library/react";
import Price from "./price";
import {render} from "test-utils";

it("shows a formated price of a product", () => {
  render(<Price price={11} />);
  expect(screen.getByText("€0.11")).toBeVisible();
});
