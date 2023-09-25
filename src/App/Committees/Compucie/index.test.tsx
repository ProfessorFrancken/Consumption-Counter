import React from "react";
import {render, fireEvent, screen} from "test-utils";
import CompucieScreen from "./index";
import moxios from "moxios";
import {Route, Routes} from "react-router";

describe("Compucie screen", () => {
  beforeEach(() => {
    moxios.install();
    const base_api = process.env.REACT_APP_API_SERVER;
    moxios.stubRequest(`https://borrelcie.vodka/chwazorcle/hoeveel.php`, {
      responseText: "10",
      status: 200,
    });
    moxios.stubRequest(`https://borrelcie.vodka/chwazorcle/hoeveel.php?increment=-1`, {});
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
    const {findByRole, getByRole} = render(<CompucieScreen />);

    expect(
      await findByRole("button", {name: /Decrease Temple Count \(10\)/i})
    ).toBeInTheDocument();
    fireEvent.click(getByRole("button", {name: /Decrease Temple Count \(10\)/}));

    expect(
      await findByRole("button", {name: /Decrease Temple Count \(9\)/})
    ).toBeInTheDocument();
  });

  it("Reloads the application", async () => {
    const {getByRole} = render(
      <Routes>
        <Route path="/compucie" element={<CompucieScreen />} />
        <Route path="*" element={<span role="progressbar">loading</span>} />
      </Routes>,
      {routes: ["/compucie"]}
    );

    fireEvent.click(getByRole("button", {name: /Refresh/}));

    expect(await screen.findByRole("progressbar")).toBeInTheDocument();
  });
});
