import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {actions, TYPES, TIME_TO_CANCEL} from "./actions";
import expect from "expect"; // You can use any testing library
import {push} from "connected-react-router";
import api from "./api";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'jest... Remove this comment to see the full error message
import clock from "jest-plugin-clock";
import moxios from "moxios";

const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore(middlewares);

const base_api = process.env.REACT_APP_API_SERVER;

describe("Fetching initial data", () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());
  clock.set("2018-01-01");

  it("Fetches members and products", (done) => {
    moxios.stubRequest(`${base_api}/members`, {
      response: {
        members: [],
      },
    });
    moxios.stubRequest(`${base_api}/products`, {
      response: {
        products: [],
      },
    });
    moxios.stubRequest(`${base_api}/boards`, {
      response: {
        boardMembers: [],
      },
    });
    moxios.stubRequest(`${base_api}/committees`, {
      response: {
        committees: [],
      },
    });
    moxios.stubRequest(/statistics\/categories.*/, {
      response: {
        statistics: [],
      },
    });
    moxios.stubRequest(/statistics\/activities.*/, {
      response: {
        activities: [],
      },
    });

    const expectedActions = [
      {type: TYPES.LOAD_APPLICATION_REQUEST},
      {type: TYPES.FETCH_STATISTICS_REQUEST},
      {type: TYPES.FETCH_ACTIVITIES_REQUEST},
      {type: TYPES.FETCH_STATISTICS_SUCCESS, statistics: []},
      {type: TYPES.FETCH_ACTIVITIES_SUCCESS, activities: []},
      {type: TYPES.LOAD_APPLICATION_SUCCESS},
    ];

    const store = mockStore({members: []});
    store
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '(dispatch: any) => Promise<any>'... Remove this comment to see the full error message
      .dispatch(actions.fetchInitialData())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      })
      .catch((e: any) => done.fail(e));
  });
});

describe("buying products", () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  clock.set("2018-02-23");

  describe("making an order", () => {
    beforeEach(() => jest.useFakeTimers());

    it("makes an order", (done) => {
      // and when adding a product to order
      const products = [{id: 2}];
      const member = {id: 1};
      const store = mockStore();
      store
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '(dispatch: any, getState: any) =... Remove this comment to see the full error message
        .dispatch(actions.makeOrder({member, products}))
        .then(() => {
          // then we buy a product
          expect(store.getActions()).toEqual([
            {
              type: TYPES.QUEUE_ORDER,
              order: {products, member, ordered_at: 1519344000000},
            },
            push("/"),
          ]);
        })
        .then(done)
        .catch((e: any) => done.fail(e));

      jest.clearAllTimers();
    });

    it("buys an order after x seconds", (done) => {
      moxios.stubRequest(`${base_api}/orders`, {
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ request: {}; headers: { "conte... Remove this comment to see the full error message
        request: {},
        headers: {"content-type": "application/json"},
      });

      const flushAllPromises = () => new Promise((resolve) => setImmediate(resolve));

      // and when adding a product to order
      const product = {id: 2};
      const products = [product];
      const member = {id: 1};
      const order = {
        products: [product],
        member: member,
        ordered_at: 1519344000000,
      };
      const store = mockStore();
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '(dispatch: any, getState: any) =... Remove this comment to see the full error message
      store.dispatch(actions.makeOrder(order)).then(() => {
        jest.runTimersToTime(TIME_TO_CANCEL);

        flushAllPromises()
          .then(() => {
            // then we buy a product
            expect(store.getActions()).toEqual([
              {
                type: TYPES.QUEUE_ORDER,
                order,
              },
              push("/"),
              {type: TYPES.BUY_ORDER_REQUEST, order},
              {type: TYPES.BUY_ORDER_SUCCESS, order},
            ]);
          })
          .then(done)
          .catch((e) => done.fail(e));
      });
    });

    it("can cancel buying an order", (done) => {
      // and when adding a product to order
      const products = [{id: 2}];
      const member = {id: 1};
      const order = {member, products, ordered_at: 1519344000000};
      const store = mockStore();

      store
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '(dispatch: any, getState: any) =... Remove this comment to see the full error message
        .dispatch(actions.makeOrder(order))
        .then(() => {
          store.dispatch(
            // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '(dispatch: any) => void' is not ... Remove this comment to see the full error message
            actions.cancelOrder({products, member, ordered_at: 1519344000000})
          );
          jest.runTimersToTime(TIME_TO_CANCEL);

          expect(store.getActions()).toEqual([
            {
              type: TYPES.QUEUE_ORDER,
              order: {products, member, ordered_at: 1519344000000},
            },
            push("/"),
            {
              type: TYPES.CANCEL_ORDER,
              order: {products, member, ordered_at: 1519344000000},
            },
          ]);
        })
        .then(done)
        .catch((e: any) => done.fail(e));
    });
  });

  describe("cancelling orders", () => {
    it("waits a few seconds before buying an order so that a member can cancel its order", () => {});
  });
});
