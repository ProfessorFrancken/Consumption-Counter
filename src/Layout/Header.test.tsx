import React from "react";
import Header from "./Header";
import {getMember, render} from "test-utils";

it("renders a buy more button when visiting the products page", () => {
  const storeState = {
    order: {
      member: getMember(),
      products: [],
    },
    queuedOrder: null,
  };

  const routes = ["/products"];

  const {getByText} = render(<Header />, {storeState, routes});

  expect(getByText("Show prices")).toBeDefined();
});
