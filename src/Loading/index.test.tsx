import React from "react";
import {render, fireEvent} from "test-utils";
import LoadingScreen from "./index";
import moxios from "moxios";
import {LOADING_STATE} from "./reducers";

describe("Loading screen", () => {
  it("renders", () => {
    const storeState = {
      loading: {
        state: LOADING_STATE.REQUESTING,
        features: [
          {loading: LOADING_STATE.REQUESTING, label: "Members"},
          {loading: LOADING_STATE.SUCCESS, label: "Committees"},
          {loading: LOADING_STATE.FAILURE, label: "Boards"},
        ],
      },
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
    const {getByRole, getByLabelText} = render(<LoadingScreen />, {storeState});

    expect(
      getByRole("heading", {name: "Loading consumption counter..."})
    ).toBeInTheDocument();

    expect(getByLabelText("Loading Members")).toBeInTheDocument();
    expect(getByLabelText("Succesfully loaded Committees")).toBeInTheDocument();
    expect(getByLabelText("Failed loading Boards")).toBeInTheDocument();
  });
});
