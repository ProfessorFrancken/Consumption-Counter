import Header from "./Header";
import {render} from "test-utils";

it("renders a buy more button when visiting the products page", () => {
  const storeState = {
    queuedOrder: null,
  };

  const routes = ["/products?memberId=1"];

  const {getByText} = render(<Header />, {storeState, routes});

  expect(getByText("Show prices")).toBeDefined();
});
