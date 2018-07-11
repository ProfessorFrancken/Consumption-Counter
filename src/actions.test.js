import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { actions, TYPES, TIME_TO_CANCEL } from './actions';
import fetchMock from 'fetch-mock';
import expect from 'expect'; // You can use any testing library
import { push, goBack } from 'react-router-redux';
import api from './api';
import clock from 'jest-plugin-clock';
import moxios from 'moxios';

const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore(middlewares);

const base_api = process.env.REACT_APP_API_SERVER;

describe('Fetching initial data', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());
  clock.set('2018-01-01');

  it('Fetches members and products', done => {
    moxios.stubRequest(`${base_api}/members`, {
      response: {
        members: []
      }
    });
    moxios.stubRequest(`${base_api}/products`, {
      response: {
        products: []
      }
    });
    moxios.stubRequest(`${base_api}/boards`, {
      response: {
        boardMembers: []
      }
    });
    moxios.stubRequest(`${base_api}/committees`, {
      response: {
        committees: []
      }
    });
    moxios.stubRequest(
      `${base_api}/statistics/categories?startDate=2017-07-01&endDate=2018-01-01`,
      {
        response: {
          statistics: []
        }
      }
    );

    const expectedActions = [
      { type: TYPES.FETCH_MEMBERS_REQUEST },
      { type: TYPES.FETCH_PRODUCTS_REQUEST },
      { type: TYPES.FETCH_BOARD_MEMBERS_REQUEST },
      { type: TYPES.FETCH_COMMITTEE_MEMBERS_REQUEST },
      { type: TYPES.FETCH_STATISTICS_REQUEST },
      { type: TYPES.FETCH_MEMBERS_SUCCESS, members: [] },
      { type: TYPES.FETCH_PRODUCTS_SUCCESS, products: [] },
      { type: TYPES.FETCH_BOARD_MEMBERS_SUCCESS, boardMembers: [] },
      { type: TYPES.FETCH_COMMITTEE_MEMBERS_SUCCESS, committees: [] },
      { type: TYPES.FETCH_STATISTICS_SUCCESS, statistics: [] }
    ];

    const store = mockStore({ members: [] });
    store
      .dispatch(actions.fetchInitialData())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      })
      .catch(e => done.fail(e));
  });
});

describe('fetching members', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  clock.set('2018-01-01');

  it('maps members from an http request', done => {
    moxios.stubRequest(`${base_api}/members`, {
      response: {
        members: [
          {
            id: 314,
            voornaam: 'John',
            initialen: '',
            tussenvoegsel: '',
            achternaam: 'Snow',
            geboortedatum: '2000-04-26',
            prominent: null,
            kleur: null,
            afbeelding: null,
            bijnaam: null,
            button_width: null,
            button_height: null,
            lastest_purchase_at: undefined
          },
          {
            id: 313,
            voornaam: 'Arya',
            initialen: '',
            tussenvoegsel: '',
            achternaam: 'Stark',
            geboortedatum: null,
            prominent: null,
            kleur: null,
            afbeelding: null,
            bijnaam: null,
            button_width: null,
            button_height: null,
            lastest_purchase_at: undefined
          }
        ]
      },
      headers: { 'content-type': 'application/json' }
    });

    const expectedActions = [
      { type: TYPES.FETCH_MEMBERS_REQUEST },
      {
        type: TYPES.FETCH_MEMBERS_SUCCESS,
        members: [
          {
            id: 314,
            age: 17,
            firstName: 'John',
            surname: 'Snow',
            fullname: 'John Snow',
            prominent: null,
            latest_purchase_at: null,
            cosmetics: {
              color: null,
              image: null,
              nickname: null,
              button: {
                height: null,
                width: null
              }
            }
          },
          {
            id: 313,
            age: 0,
            firstName: 'Arya',
            surname: 'Stark',
            fullname: 'Arya Stark',
            prominent: null,
            latest_purchase_at: null,
            cosmetics: {
              color: null,
              image: null,
              nickname: null,
              button: {
                height: null,
                width: null
              }
            }
          }
        ]
      }
    ];

    const store = mockStore();

    store
      .dispatch(actions.fetchMembers())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      })
      .catch(e => done.fail(e));
  });

  it('it fails if the http request fails', done => {
    moxios.stubRequest(`${base_api}/members`, {
      status: 400,
      headers: { 'content-type': 'application/json' }
    });

    const expectedActions = [
      { type: TYPES.FETCH_MEMBERS_REQUEST },
      { type: TYPES.FETCH_MEMBERS_FAILURE }
    ];

    const store = mockStore();

    store
      .dispatch(actions.fetchMembers())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      })
      .catch(e => done.fail(e));
  });

  xit("assumes a person is not allowed to buy beer if they don't have a birthday", () => {});
});

describe('fetching board members', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it('maps board members from an http request', done => {
    moxios.stubRequest(`${base_api}/boards`, {
      response: {
        boardMembers: [{ lid_id: 314, jaar: 2018, functie: 'King' }]
      },
      headers: { 'content-type': 'application/json' }
    });

    const expectedActions = [
      { type: TYPES.FETCH_BOARD_MEMBERS_REQUEST },
      {
        type: TYPES.FETCH_BOARD_MEMBERS_SUCCESS,
        boardMembers: [{ member_id: 314, year: 2018, function: 'King' }]
      }
    ];

    const store = mockStore();

    store
      .dispatch(actions.fetchBoardMembers())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      })
      .catch(e => done.fail(e));
  });

  it('it fails if the http request fails', done => {
    moxios.stubRequest(`${base_api}/boards`, {
      status: 400,
      headers: { 'content-type': 'application/json' }
    });

    const expectedActions = [
      { type: TYPES.FETCH_BOARD_MEMBERS_REQUEST },
      { type: TYPES.FETCH_BOARD_MEMBERS_FAILURE }
    ];

    const store = mockStore();

    store
      .dispatch(actions.fetchBoardMembers())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      })
      .catch(e => done.fail(e));
  });
});

describe('fetching committee members', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it('maps committee members from an http request', done => {
    moxios.stubRequest(`${base_api}/committees`, {
      response: {
        committees: [
          {
            lid_id: 314,
            jaar: 2018,
            functie: 'King',
            naam: "Night's watch",
            commissie_id: 1
          }
        ]
      },
      headers: { 'content-type': 'application/json' }
    });

    const expectedActions = [
      { type: TYPES.FETCH_COMMITTEE_MEMBERS_REQUEST },
      {
        type: TYPES.FETCH_COMMITTEE_MEMBERS_SUCCESS,
        committees: [
          {
            member_id: 314,
            year: 2018,
            function: 'King',
            committee: { id: 1, name: "Night's watch" }
          }
        ]
      }
    ];

    const store = mockStore();

    store
      .dispatch(actions.fetchCommitteeMembers())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      })
      .catch(e => done.fail(e));
  });

  it('it fails if the http request fails', done => {
    moxios.stubRequest(`${base_api}/committees`, {
      status: 400,
      headers: { 'content-type': 'application/json' }
    });

    const expectedActions = [
      { type: TYPES.FETCH_COMMITTEE_MEMBERS_REQUEST },
      { type: TYPES.FETCH_COMMITTEE_MEMBERS_FAILURE }
    ];

    const store = mockStore();

    store
      .dispatch(actions.fetchCommitteeMembers())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      })
      .catch(e => done.fail(e));
  });
});

describe('fetching products', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it('maps products from an http request', done => {
    moxios.stubRequest(`${base_api}/products`, {
      response: {
        products: [
          {
            id: 1,
            naam: 'Grolsch',
            prijs: '0.6500',
            categorie: 'Bier',
            positie: 999,
            beschikbaar: 1,
            afbeelding: 'Uo6qQC4Hm8TUqyNjw2G4.jpg',
            splash_afbeelding: null,
            kleur: null
          },
          {
            id: 2,
            naam: 'Heineken',
            prijs: '0.6000',
            categorie: 'Bier',
            positie: 999,
            beschikbaar: 0,
            afbeelding: '',
            splash_afbeelding: null,
            kleur: null
          }
        ]
      },
      headers: { 'content-type': 'application/json' }
    });

    const expectedActions = [
      { type: TYPES.FETCH_PRODUCTS_REQUEST },
      {
        type: TYPES.FETCH_PRODUCTS_SUCCESS,
        products: [
          {
            age_restriction: 18,
            category: 'Bier',
            id: 1,
            image: 'Uo6qQC4Hm8TUqyNjw2G4.jpg',
            splash_image: null,
            name: 'Grolsch',
            position: 999,
            price: 65
          },
          {
            age_restriction: 18,
            category: 'Bier',
            id: 2,
            image: '',
            splash_image: null,
            name: 'Heineken',
            position: 999,
            price: 60
          }
        ]
      }
    ];

    const store = mockStore();

    store
      .dispatch(actions.fetchProducts())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      })
      .catch(e => done.fail(e));
  });

  it('it fails if the http request fails', done => {
    moxios.stubRequest(`${base_api}/products`, {
      status: 400,
      headers: { 'content-type': 'application/json' }
    });

    const expectedActions = [
      { type: TYPES.FETCH_PRODUCTS_REQUEST },
      { type: TYPES.FETCH_PRODUCTS_FAILURE }
    ];

    const store = mockStore();

    store
      .dispatch(actions.fetchProducts())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      })
      .catch(e => done.fail(e));
  });
});

describe('selecing a member', () => {
  it('should first select a range of surnames', () => {
    const store = mockStore({});

    store.dispatch(
      actions.selectRangeOfSurnames({
        idx: 0,
        range: [],
        surname_start: 'A',
        surname_end: 'B'
      })
    );

    expect(store.getActions()).toEqual([push('/members/0')]);
  });

  it('should select a member from a range of members', () => {
    const store = mockStore({});
    const member = {
      id: 1,
      firstName: 'John',
      surname: 'Snow',
      age: 18,
      prominent: 0,
      latest_purchase_at: new Date(),

      cosmetics: {
        color: undefined,
        image: undefined,
        nickname: undefined,
        button: {
          width: undefined,
          height: undefined
        }
      }
    };

    store.dispatch(actions.selectMember(member));

    expect(store.getActions()).toEqual([
      push('/products'),
      {
        type: TYPES.SELECT_MEMBER,
        member
      }
    ]);
  });
});

describe('cancelling', () => {
  it('can cancel any selecion by going back', () => {
    const store = mockStore({});

    store.dispatch(actions.goBack());

    expect(store.getActions()).toEqual([goBack(), { type: TYPES.GO_BACK }]);
  });
});

describe('buying products', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  clock.set('2018-02-23');

  it('is possible to toggle buying more products', () => {
    expect(actions.buyMore()).toEqual({ type: TYPES.BUY_MORE });
  });

  it('does not inmediadly make an order when a product was already added to the order', () => {
    // when a member is selected and we buy multiple products
    const member = { id: 1 };
    const store = mockStore({ order: { member, products: [{ id: 1 }] } });

    // and when adding a product to order
    const product = { id: 2 };
    store.dispatch(actions.addProductToOrder(product));

    // then we buy a product
    expect(store.getActions()).toEqual([
      { type: TYPES.ADD_PRODUCT_TO_ORDER, product }
    ]);
  });

  it('buys an order after only adding 1 product to an order', done => {
    jest.useFakeTimers();
    // when a member is selected
    // and we only buy one product
    const member = { id: 1 };
    const product = { id: 2 };
    const store = mockStore({
      order: {
        member,
        products: []
      }
    });

    moxios.stubRequest(`${base_api}/orders`, {
      request: {},
      headers: { 'content-type': 'application/json' }
    });

    // and when adding a product to order
    const order = { products: [product], member, ordered_at: 1519344000000 };
    const flushAllPromises = () =>
      new Promise(resolve => setImmediate(resolve));
    store.dispatch(actions.addProductToOrder(product)).then(() => {
      jest.runTimersToTime(TIME_TO_CANCEL);

      flushAllPromises()
        .then(() => {
          // then we buy a product
          expect(store.getActions()).toEqual([
            { type: TYPES.QUEUE_ORDER, order },
            push('/'),
            { type: TYPES.BUY_ORDER_REQUEST, order },
            { type: TYPES.BUY_ORDER_SUCCESS, order }
          ]);
        })
        .then(done)
        .catch(e => done.fail(e));
    });
  });

  describe('making an order', () => {
    beforeEach(() => jest.useFakeTimers());

    it('makes an order', done => {
      // and when adding a product to order
      const products = [{ id: 2 }];
      const member = { id: 1 };
      const store = mockStore();
      store
        .dispatch(actions.makeOrder({ member, products }))
        .then(() => {
          // then we buy a product
          expect(store.getActions()).toEqual([
            {
              type: TYPES.QUEUE_ORDER,
              order: { products, member, ordered_at: 1519344000000 }
            },
            push('/')
          ]);
        })
        .then(done)
        .catch(e => done.fail(e));

      jest.clearAllTimers();
    });

    it('buys an order after x seconds', done => {
      moxios.stubRequest(`${base_api}/orders`, {
        request: {},
        headers: { 'content-type': 'application/json' }
      });

      const flushAllPromises = () =>
        new Promise(resolve => setImmediate(resolve));

      // and when adding a product to order
      const product = { id: 2 };
      const products = [product];
      const member = { id: 1 };
      const order = {
        products: [product],
        member: member,
        ordered_at: 1519344000000
      };
      const store = mockStore();
      store.dispatch(actions.makeOrder(order)).then(() => {
        jest.runTimersToTime(TIME_TO_CANCEL);

        flushAllPromises()
          .then(() => {
            // then we buy a product
            expect(store.getActions()).toEqual([
              {
                type: TYPES.QUEUE_ORDER,
                order
              },
              push('/'),
              { type: TYPES.BUY_ORDER_REQUEST, order },
              { type: TYPES.BUY_ORDER_SUCCESS, order }
            ]);
          })
          .then(done)
          .catch(e => done.fail(e));
      });
    });

    it('can cancel buying an order', done => {
      // and when adding a product to order
      const products = [{ id: 2 }];
      const member = { id: 1 };
      const order = { member, products, ordered_at: 1519344000000 };
      const store = mockStore();

      store
        .dispatch(actions.makeOrder(order))
        .then(() => {
          store.dispatch(
            actions.cancelOrder({ products, member, ordered_at: 1519344000000 })
          );
          jest.runTimersToTime(TIME_TO_CANCEL);

          expect(store.getActions()).toEqual([
            {
              type: TYPES.QUEUE_ORDER,
              order: { products, member, ordered_at: 1519344000000 }
            },
            push('/'),
            {
              type: TYPES.CANCEL_ORDER,
              order: { products, member, ordered_at: 1519344000000 }
            }
          ]);
        })
        .then(done)
        .catch(e => done.fail(e));
    });
  });

  describe('cancelling orders', () => {
    it('waits a few seconds before buying an order so that a member can cancel its order', () => {});
  });
});

describe('committees', () => {
  it('selects a committee', () => {
    const store = mockStore({});

    store.dispatch(actions.selectCommittee({ id: 0 }));

    expect(store.getActions()).toEqual([
      push('/committees/0'),
      {
        type: TYPES.SELECT_COMMITTEE,
        committee: { id: 0 }
      }
    ]);
  });
});

it('plays chwazi', () => {
  fetchMock.mock(
    `https://borrelcie.vodka/chwazorcle/hoeveel.php?increment=-1`,
    {
      headers: { 'content-type': 'application/json' }
    }
  );

  const store = mockStore({});
  store.dispatch(actions.chwazi());

  expect(fetchMock.calls.length).toBe(1);

  fetchMock.reset();
  fetchMock.restore();
});
