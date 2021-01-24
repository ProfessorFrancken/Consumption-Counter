import React from "react";
import AvailableProducts from "./index";
import configureMockStore from "redux-mock-store";
import {render} from "test-utils";
import {Provider} from "react-redux";
import thunk from "redux-thunk";

it("renders, and it does not include products that a member is not allowed to buy (due to age distriction)", () => {
  const api = {
    post: jest.fn(),
  };
  const mockStore = configureMockStore([thunk.withExtraArgument(api)]);

  const store = mockStore({
    products: {
      Bier: [{name: "Hertog Jan", image: "", id: 1, age_restriction: 18}],
      Fris: [{name: "Ice Tea", image: "", id: 2, age_restriction: null}],
      Eten: [],
    },
    order: {member: {age: 17}, products: []},
  });
  const {queryByLabelText, getByLabelText, getAllByRole} = render(
    <Provider store={store}>
      {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ store: MockStoreEnhanced<unknown, {}>; }' ... Remove this comment to see the full error message */}
      <AvailableProducts store={store} />
    </Provider>
  );

  expect(queryByLabelText("beer category")).toBeNull();
  expect(queryByLabelText("soda category")).not.toBeNull();

  const soda = getByLabelText("soda category");
  expect(getAllByRole("button", soda)).toHaveLength(1);
});

it("shows the amount of products that are currently being orderd", () => {
  const api = {
    post: jest.fn(),
  };
  const mockStore = configureMockStore([thunk.withExtraArgument(api)]);

  const store = mockStore({
    products: {
      Bier: [{name: "Hertog Jan", image: "", id: 1, age_restriction: 18}],
      Fris: [{name: "Ice Tea", image: "", id: 2, age_restriction: null}],
      Eten: [],
    },
    order: {
      member: {age: 19},
      products: [
        {
          id: 1,
          name: "Hertog Jan",
          price: 65,
        },
        {
          id: 1,
          name: "Hertog Jan",
          price: 65,
        },
      ],
    },
  });

  const {getAllByLabelText} = render(
    <Provider store={store}>
      {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ store: MockStoreEnhanced<unknown, {}>; }' ... Remove this comment to see the full error message */}
      <AvailableProducts store={store} />
    </Provider>
  );

  const orderedProducts = getAllByLabelText("amount ordered");
  expect(orderedProducts).toHaveLength(1);
  expect(orderedProducts[0]).toHaveTextContent("2");
});
