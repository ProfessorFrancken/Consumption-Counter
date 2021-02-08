import React from "react";
import {render, fireEvent} from "test-utils";
import CompucieScreen from "./index";
import moxios from "moxios";
import {history} from "./../../../Setup/store";

describe("Compucie screen", () => {
  beforeEach(() => {
    moxios.install();
    const base_api = process.env.REACT_APP_API_SERVER;
    moxios.stubRequest(`https://borrelcie.vodka/chwazorcle/hoeveel.php`, {
      responseText: "10",
      status: 200,
    });
  });

  it("renders", () => {
    const storeState = {
      members: [
        {id: 1, fullname: "John Snow", cosmetics: {}},
        {id: 2, fullname: "Arya Stark", cosmetics: {}},
      ],
      committeeMembers: [
        {
          member_id: 1,
          year: 2017,
          function: "King",
          committee: {id: 1, name: "Compucie"},
        },
        {
          member_id: 2,
          year: 2017,
          function: "",
          committee: {id: 2, name: "s[ck]rip(t|t?c)ie"},
        },
      ],
    };
    const {getByRole} = render(<CompucieScreen />, {storeState});

    expect(getByRole("button", {name: /John Snow/})).toBeInTheDocument();
    expect(getByRole("button", {name: /Arya Stark/})).toBeInTheDocument();
  });

  it("Decreases the temple count", async () => {
    moxios.stubRequest(`https://borrelcie.vodka/chwazorcle/hoeveel.php?increment=-1`, {});
    const {findByRole, getByRole} = render(<CompucieScreen />);

    expect(
      await findByRole("button", {name: /Decrease Temple Count \(10\)/i, exact: false})
    ).toBeInTheDocument();
    fireEvent.click(getByRole("button", {name: /Decrease Temple Count \(10\)/}));

    expect(
      await findByRole("button", {name: /Decrease Temple Count \(9\)/})
    ).toBeInTheDocument();
  });

  it("Reloads the application", async () => {
    const {queryByRole, findByRole, getByRole} = render(<CompucieScreen />);

    fireEvent.click(getByRole("button", {name: /Refresh/}));
    expect(history.location.pathname).toBe("/loading");
  });
});
