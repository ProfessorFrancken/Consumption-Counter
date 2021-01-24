import React from "react";
import {default as CommitteesContainer} from "./index";
import configureMockStore from "redux-mock-store";
import {render, within} from "test-utils";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'jest... Remove this comment to see the full error message
import clock from "jest-plugin-clock";

describe("committees", () => {
  clock.set("2018-01-01");

  it("renders", () => {
    const mockStore = configureMockStore([thunk]);

    const state = {
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
    const store = mockStore({...state});
    const {getByLabelText} = render(
      <Provider store={store}>
        {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ store: MockStoreEnhanced<unknown, {}>; }' ... Remove this comment to see the full error message */}
        <CommitteesContainer store={store} />
      </Provider>
    );

    expect(within(getByLabelText("committees")).getAllByRole("button")).toHaveLength(1);
  });

  it("ignores committee members that aren't in the system", () => {
    const mockStore = configureMockStore([thunk]);
    const state = {
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
    const store = mockStore({...state});
    const {getByLabelText} = render(
      <Provider store={store}>
        {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ store: MockStoreEnhanced<unknown, {}>; }' ... Remove this comment to see the full error message */}
        <CommitteesContainer store={store} />
      </Provider>
    );

    expect(within(getByLabelText("committees")).getAllByRole("button")).toHaveLength(1);
  });
});
