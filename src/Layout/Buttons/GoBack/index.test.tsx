import React from "react";
import GoBack from ".";
import configureMockStore from "redux-mock-store";
import {MemoryRouter} from "react-router-dom";
import {TYPES} from "actions";
import {push, goBack} from "connected-react-router";
import thunk from "redux-thunk";
import {render, fireEvent} from "test-utils";
import {Provider} from "react-redux";

describe("<GoBack />", () => {
  it("renders", () => {
    const mockStore = configureMockStore([thunk]);

    const store = mockStore({queuedOrder: null});
    const {getByRole} = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/products"]}>
          <GoBack />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(getByRole("button"));

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
    const {getByRole} = render(
      <Provider store={store}>
        <MemoryRouter>
          <GoBack />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(getByRole("button"));

    expect(store.getActions()).toEqual([
      push("/products"),
      {type: TYPES.SELECT_MEMBER, member},
    ]);
  });
});
