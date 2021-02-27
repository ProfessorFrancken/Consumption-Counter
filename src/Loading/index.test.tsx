import React from "react";
import {render} from "test-utils";
import LoadingScreen from "./index";
import moxios from "moxios";

describe("Loading screen", () => {
  it("renders", async () => {
    moxios.install();
    const base_api = process.env.REACT_APP_API_SERVER;
    const members = [
      {
        id: 314,
        voornaam: "John",
        initialen: "",
        tussenvoegsel: "",
        achternaam: "Snow",
        geboortedatum: "2000-01-01",
        prominent: null,
        kleur: null,
        afbeelding: null,
        bijnaam: null,
        button_width: null,
        button_height: null,
        latest_purchase_at: "2018-01-01 00:00:00",
      },
    ];

    moxios.stubRequest(`${base_api}/members`, {
      response: {members: members},
      headers: {"content-type": "application/json"},
    });
    moxios.stubRequest(`${base_api}/boards`, {
      headers: {"content-type": "application/json"},
      status: 500,
      response: {error: "moi"},
    });

    const storeState = {
      members: null,
      boardMembers: null,
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
    const {getByRole, getByLabelText, findByLabelText} = render(<LoadingScreen />, {
      storeState,
    });

    expect(
      getByRole("heading", {name: "Loading consumption counter..."})
    ).toBeInTheDocument();

    expect(getByLabelText("Loading Members")).toBeInTheDocument();
    expect(getByLabelText("Loading Boards")).toBeInTheDocument();
    expect(getByLabelText("Succesfully loaded Committees")).toBeInTheDocument();
    expect(await findByLabelText("Failed loading Boards")).toBeInTheDocument();
  });
});
