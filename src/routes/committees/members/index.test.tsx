import React from "react";
import {screen} from "@testing-library/react";
import {default as SelectCommitteeMembersContainer} from "./index";
import {render} from "test-utils";
import clock from "jest-plugin-clock";
import {Route, Routes} from "react-router-dom";

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

    render(
      <Routes>
        <Route path="/committees/:page" element={<SelectCommitteeMembersContainer />} />
      </Routes>,
      {storeState, routes}
    );

    expect(screen.getByRole("button", {name: "John Snow"})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Arya Stark"})).toBeInTheDocument();
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

    render(
      <Routes>
        <Route path="/committees/:page" element={<SelectCommitteeMembersContainer />} />
      </Routes>,
      {storeState, routes}
    );

    expect(screen.getByRole("button", {name: "Arya Stark"})).toBeInTheDocument();
    expect(screen.queryByRole("button", {name: "John Snow"})).not.toBeInTheDocument();
  });
});
