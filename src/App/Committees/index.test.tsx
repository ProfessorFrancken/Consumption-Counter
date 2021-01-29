import React from "react";
import {default as CommitteesContainer} from "./index";
import {render, within} from "test-utils";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'jest... Remove this comment to see the full error message
import clock from "jest-plugin-clock";

describe("committees", () => {
  clock.set("2018-01-01");

  it("renders", () => {
    const storeState = {
      members: [{id: 1}, {id: 2}],
      committeeMembers: [
        {
          member_id: 1,
          year: 2017,
          function: "King",
          committee: {id: 1, name: "Board"},
        },
        {
          member_id: 2,
          year: 2017,
          function: "",
          committee: {id: 1, name: "Board"},
        },
      ],
    };
    const {getByLabelText} = render(<CommitteesContainer />, {storeState});

    expect(within(getByLabelText("committees")).getAllByRole("button")).toHaveLength(1);
  });

  it("ignores committee members that aren't in the system", () => {
    const storeState = {
      members: [{id: 1}],
      committeeMembers: [
        {
          member_id: 1,
          year: 2017,
          function: "King",
          committee: {id: 1, name: "Board"},
        },
        {
          member_id: 2,
          year: 2017,
          function: "",
          committee: {id: 2, name: "Compucie"},
        },
      ],
    };
    const {getByLabelText} = render(<CommitteesContainer />, {storeState});

    expect(within(getByLabelText("committees")).getAllByRole("button")).toHaveLength(1);
  });
});
