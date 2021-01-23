import React from "react";
import Price from "./Price";
import {mount} from "enzyme";

it("shows a formated price of a product", () => {
  const price = mount(<Price price={11} />);
  expect(price.text()).toEqual("€0.11");
});
