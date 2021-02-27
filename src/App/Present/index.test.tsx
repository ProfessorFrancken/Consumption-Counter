import React from "react";
import {render, fireEvent} from "test-utils";
import PresentScreen from "./index";
import moxios from "moxios";
import {history} from "Root";

describe("Present screen", () => {
  it("Shows members that are present in the members room", async () => {
    moxios.install();
    moxios.stubRequest(`https://borrelcie.vodka/present/data.php`, {
      response: ["Mark"],
    });
    const {findByRole, getByText, getByRole} = render(<PresentScreen />, {
      storeState: {members: [{id: 1403, fullname: "John Snow", cosmetics: {}}]},
    });

    expect(getByText("Sponsored by", {exact: false})).toBeInTheDocument();
    expect(await findByRole("button", {name: /John Snow/})).toBeInTheDocument();
  });
});
