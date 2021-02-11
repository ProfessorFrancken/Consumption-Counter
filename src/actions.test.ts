import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {actions, TYPES} from "./actions";
import expect from "expect"; // You can use any testing library
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
