import React from "react";
import {screen} from "@testing-library/react";
import Footer from "./Footer";
import {render} from "test-utils";

it("renders without crashing", () => {
  render(<Footer />);

  expect(
    screen.getByLabelText("Partners sponsoring the consumption counter")
  ).toBeInTheDocument();
  expect(screen.getByRole("contentinfo")).toBeInTheDocument();
});
