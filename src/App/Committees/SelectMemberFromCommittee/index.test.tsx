import React from "react";
import {default as SelectCommitteeMembersContainer} from "./index";
import {Route} from "react-router-dom";
import {render} from "test-utils";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'jest... Remove this comment to see the full error message
import clock from "jest-plugin-clock";

describe("committees", () => {
  clock.set("2018-01-01");

  it("ignores duplicated committee members", () => {
    const storeState = {
      members: [
        {id: 1, cosmetics: {}, fullname: "John Snow"},
        {id: 2, cosmetics: {}, fullname: "Arya Stark"},
      ],
      committeeMembers: [
        {
          member_id: 1,
          year: 2017,
          function: "King",
          committee: {id: 1, name: "Board"},
        },
        {
          member_id: 1,
          year: 2016,
          function: "King",
          committee: {id: 1, name: "Board"},
        },
        {
          member_id: 2,
          year: 2017,
          function: "Queen",
          committee: {id: 1, name: "Board"},
        },
      ],
    };
    const routes = ["/committees/1"];
    const screen = render(
      <Route
        exact
        path="/committees/:page"
        component={SelectCommitteeMembersContainer}
      />,
      {storeState, routes}
    );

    expect(screen.queryAllByRole("button")).toHaveLength(2);
  });
});
