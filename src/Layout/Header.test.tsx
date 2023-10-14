import Header from "./Header";
import {render, screen} from "test-utils";

it("renders a buy more button when visiting the products page", () => {
  const storeState = {
    queuedOrder: null,
  };

  const routes = ["/products?memberId=1"];

  render(<Header />, {storeState, routes});

  expect(screen.getByText("Show prices")).toBeDefined();
});
