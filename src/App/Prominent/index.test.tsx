import React from "react";
import {default as ProminentContainer} from "./index";
import configureMockStore from "redux-mock-store";
import {render, within} from "test-utils";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'jest... Remove this comment to see the full error message
import clock from "jest-plugin-clock";

describe("prominent", () => {
  clock.set("2018-01-01");

  it("renders", () => {
    const mockStore = configureMockStore([thunk]);

    const state = {
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
    const store = mockStore({...state});
    const {getAllByLabelText, getByLabelText, getAllByRole} = render(
      <Provider store={store}>
        {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ store: MockStoreEnhanced<unknown, {}>; }' ... Remove this comment to see the full error message */}
        <ProminentContainer store={store} />
      </Provider>
    );

    expect(getAllByLabelText("board")).toHaveLength(1);
    const board = getByLabelText("board");
    expect(getAllByRole("button", board)).toHaveLength(2);
  });

  it("ignores members that aren't in the system", () => {
    const mockStore = configureMockStore([thunk]);

    const state = {
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
    const store = mockStore({...state});
    const {getAllByLabelText, getByLabelText} = render(
      <Provider store={store}>
        {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ store: MockStoreEnhanced<unknown, {}>; }' ... Remove this comment to see the full error message */}
        <ProminentContainer store={store} />
      </Provider>
    );

    expect(getAllByLabelText("board")).toHaveLength(1);
    const board = getByLabelText("board");
    expect(within(board).getAllByRole("button")).toHaveLength(1);
  });

  it("Only shows prominent members if they bought a product recently", () => {
    const mockStore = configureMockStore([thunk]);

    const state = {
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
      ],
      boardMembers: [
        {member_id: 2, year: 2017, function: "King"},
        {member_id: 2, year: 2016, function: "King"},
        {member_id: 2, year: 2015, function: "King"},
        {member_id: 2, year: 2014, function: "King"},
        {member_id: 2, year: 2013, function: "King"},
        {member_id: 1, year: 2012, function: "King"},
      ],
    };
    const store = mockStore({...state});
    const {getByLabelText} = render(
      <Provider store={store}>
        {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ store: MockStoreEnhanced<unknown, {}>; }' ... Remove this comment to see the full error message */}
        <ProminentContainer store={store} />
      </Provider>
    );

    const board = getByLabelText("prominent members");
    expect(within(board).getAllByRole("button", board)).toHaveLength(1);
  });
});