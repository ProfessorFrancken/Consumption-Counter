import React from "react";
import {default as ProminentContainer} from "./index";
import {render, within} from "test-utils";
import clock from "jest-plugin-clock";

describe("prominent", () => {
  clock.set("2018-01-01");

  it("renders", () => {
    const storeState = {
      members: [
        {
          id: 1,
          firstName: "John",
          surname: "Snow",
          latest_purchase_at: new Date("2017-12-01"),
          cosmetics: {button: {}},
        },
        {
          id: 2,
          firstName: "John",
          surname: "Snow",
          latest_purchase_at: new Date("2017-12-01"),
          cosmetics: {button: {}},
        },
      ],
      boardMembers: [
        {member_id: 1, year: 2017, function: "King"},
        {member_id: 2, year: 2017, function: "King"},
      ],
    };
    const {getAllByLabelText, getByLabelText, getAllByRole} = render(
      <ProminentContainer />,
      {storeState}
    );

    expect(getAllByLabelText("board")).toHaveLength(1);
    const board = getByLabelText("board");
    expect(getAllByRole("button", board)).toHaveLength(2);
  });

  it("ignores members that aren't in the system", () => {
    const storeState = {
      members: [
        {
          id: 1,
          firstName: "John",
          surname: "Snow",
          latest_purchase_at: new Date("2017-12-01"),
          cosmetics: {button: {}},
        },
      ],
      boardMembers: [
        {member_id: 1, year: 2017, function: "King"},
        {member_id: 2, year: 2017, function: "King"},
      ],
    };
    const {getAllByLabelText, getByLabelText} = render(<ProminentContainer />, {
      storeState,
    });

    expect(getAllByLabelText("board")).toHaveLength(1);
    const board = getByLabelText("board");
    expect(within(board).getAllByRole("button")).toHaveLength(1);
  });

  it("Only shows prominent members if they bought a product recently", () => {
    const storeState = {
      members: [
        {
          id: 1,
          firstName: "John",
          surname: "Snow",
          latest_purchase_at: new Date("2017-12-01"),
          prominent: 999,
          cosmetics: {button: {}},
        },
        {
          id: 2,
          firstName: "Arya",
          surname: "Snow",
          latest_purchase_at: new Date("2016-12-01"),
          prominent: 999,
          cosmetics: {button: {}},
        },
        {
          id: 3,
          firstName: "Brandon",
          surname: "Stark",
          latest_purchase_at: null,
          prominent: 999,
          cosmetics: {button: {}},
        },
      ],
      boardMembers: [
        {member_id: 2, year: 2017, function: "King"},
        {member_id: 2, year: 2016, function: "King"},
        {member_id: 2, year: 2015, function: "King"},
        {member_id: 2, year: 2014, function: "King"},
        {member_id: 2, year: 2013, function: "King"},
        {member_id: 3, year: 2011, function: "Prince"},
        {member_id: 1, year: 2012, function: "King"},
      ],
    };
    const {getByLabelText} = render(<ProminentContainer />, {storeState});

    const board = getByLabelText("prominent members");
    expect(within(board).getAllByRole("button", board)).toHaveLength(1);
  });
});
