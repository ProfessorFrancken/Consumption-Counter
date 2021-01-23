import React from "react";
import Price from "./Price";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'enzy... Remove this comment to see the full error message
import {mount} from "enzyme";

it("shows a formated price of a product", () => {
  const price = mount(<Price price={11} />);
  expect(price.text()).toEqual("€0.11");
});
