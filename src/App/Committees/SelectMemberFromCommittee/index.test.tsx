import React from "react";
import {default as SelectCommitteeMembersContainer} from "./index";
import {Route} from "react-router-dom";
import {render} from "test-utils";
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
    const {getByRole} = render(
      <Route
        exact
        path="/committees/:page"
        component={SelectCommitteeMembersContainer}
      />,
      {storeState, routes}
    );

    expect(getByRole("button", {name: "John Snow"})).toBeInTheDocument();
    expect(getByRole("button", {name: "Arya Stark"})).toBeInTheDocument();
  });

  it("only shows committee members from the current board year", () => {
    const storeState = {
      members: [
        {id: 1, cosmetics: {}, fullname: "John Snow"},
        {id: 2, cosmetics: {}, fullname: "Arya Stark"},
      ],
      committeeMembers: [
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
    const {getByRole, queryByRole} = render(
      <Route
        exact
        path="/committees/:page"
        component={SelectCommitteeMembersContainer}
      />,
      {storeState, routes}
    );

    expect(getByRole("button", {name: "Arya Stark"})).toBeInTheDocument();
    expect(queryByRole("button", {name: "John Snow"})).not.toBeInTheDocument();
  });
});
