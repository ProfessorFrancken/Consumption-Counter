import React from "react";
import Footer from "./Footer";
import {render} from "test-utils";

it("renders without crashing", () => {
  const {getByRole, getByLabelText} = render(<Footer />);

  expect(
    getByLabelText("Partners sponsoring the consumption counter")
  ).toBeInTheDocument();
  expect(getByRole("contentinfo")).toBeInTheDocument();
});
