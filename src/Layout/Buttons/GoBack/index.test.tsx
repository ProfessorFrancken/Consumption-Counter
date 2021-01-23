import React from "react";
import GoBack from ".";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'redu... Remove this comment to see the full error message
import configureMockStore from "redux-mock-store";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import {MemoryRouter} from "react-router-dom";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'enzy... Remove this comment to see the full error message
import {mount} from "enzyme";
import {TYPES} from "actions";
import {push, goBack} from "connected-react-router";
import thunk from "redux-thunk";

describe("<GoBack />", () => {
  it("renders", () => {
    const mockStore = configureMockStore([thunk]);

    const store = mockStore({queuedOrder: null});
    const goback = mount(
      <MemoryRouter initialEntries={["/products"]}>
        <GoBack store={store} />
      </MemoryRouter>
    );

    goback.find("button").simulate("click");

    expect(store.getActions()).toEqual([goBack(), {type: TYPES.GO_BACK}]);
  });

  it("goes back to a previous customer", () => {
    const mockStore = configureMockStore([thunk]);

    const member = {
      id: 1,
      firstName: "John",
      surname: "Snow",
      age: 18,
      prominent: null,
      latest_purchase_at: new Date(),
      cosmetics: {
        color: null,
        image: null,
        nickname: null,
        button: {
          width: null,
          height: null,
        },
      },
    };
    const store = mockStore({
      queuedOrder: {
        ordered_at: 1,
        order: {
          member: member,
          products: [],
        },
      },
    });
    const goback = mount(
      <MemoryRouter>
        <GoBack store={store} />
      </MemoryRouter>
    );

    goback.find("button").simulate("click");

    expect(store.getActions()).toEqual([
      push("/products"),
      {type: TYPES.SELECT_MEMBER, member},
    ]);
  });
});
