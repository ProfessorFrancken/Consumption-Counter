import React from 'react';
import { mount } from 'enzyme';
import AppContainer from './AppContainer';
import fetchMock from 'fetch-mock';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { create, history } from './../Setup/store';
import { TYPES } from './../actions';

describe('Plus One', () => {
  let store, app;
  const base_api = process.env.REACT_APP_API_SERVER;

  // https://hackernoon.com/low-effort-high-value-integration-tests-in-redux-apps-d3a590bd9fd5
  const flushAllPromises = () => new Promise(resolve => setImmediate(resolve));

  beforeEach(() => {
    store = create();

    jest.useFakeTimers();

    fetchMock
      .mock(`${base_api}/members`, {
        body: { members: mocks.members },
        headers: { 'content-type': 'application/json' }
      })
      .mock(`${base_api}/products`, {
        body: { products: mocks.products },
        headers: { 'content-type': 'application/json' }
      })
      .mock(`${base_api}/boards`, {
        body: { boardMembers: mocks.boards },
        headers: { 'content-type': 'application/json' }
      })
      .mock(`${base_api}/committees`, {
        body: { committees: mocks.committees },
        headers: { 'content-type': 'application/json' }
      })
      .mock(`${base_api}/orders`, {});

    app = mount(
      <Provider store={store}>
        <Router history={history}>
          <AppContainer />
        </Router>
      </Provider>
    );

    // Not sure why, but we need to manually update our app in order
    // for app.find() to work correclty (otherwise we get an timeout exception)
    return flushAllPromises().then(() => app.update());
  });

  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  const selectRangeIncludingJohnSnow = app => {
    expect(app.find('SurnameRanges').length).toBe(1);
    expect(app.find('SurnameRanges').find('button').length).toBe(1);
    const selectJohn = app.find('SurnameRanges').find('button');
    selectJohn.simulate('click');
  };

  const selectJohnSnow = app => {
    expect(app.find('Member').length).toBe(1);

    app.find('Member').simulate('click');
    expect(history.location.pathname).toBe('/products');
  };

  const addHertogJanToOrder = app => {
    expect(history.location.pathname).toBe('/products');
    expect(app.find('Product').length).toBe(3);
    expect(app.find('Product').find('button').length).toBe(3);

    const hertogJanButton = app
      .find('Product')
      .find('button')
      .first();

    hertogJanButton.simulate('click');
  };

  const expectOrderToBeBought = (app, expectedOrder, done) => {
    // The cancel button should be shown until the timeout is run
    expect(app.find('CancelOrder').find('button').length).toBe(1);
    jest.runTimersToTime(10000);

    flushAllPromises()
      .then(() => {
        expect(fetchMock.calls(`${base_api}/orders`, 'post').length).toBe(1);
        const calls = fetchMock.lastCall(`${base_api}/orders`, 'post');

        expect(JSON.parse(calls[1].body)).toEqual(expectedOrder);

        expect(history.location.pathname).toBe('/');

        done();
      })
      .catch(e => {
        done.fail(e);
      });
  };

  const selectBuyMore = app => {
    expect(app.find('BuyMore').find('input').length).toBe(1);
    const select = app
      .find('BuyMore')
      .find('input')
      .first();
    expect(select.props().checked).toBeFalsy();
    select.simulate('change');
  };

  const expectBuyMoreToBeSelected = app => {
    const select = app
      .find('BuyMore')
      .find('input')
      .first();
    expect(select.props().checked).toBeTruthy();
  };

  const buyAll = (app, done) => {
    expect(app.find('BuyMore').find('button').length).toBe(1);
    const buyAll = app
      .find('BuyMore')
      .find('button')
      .first();
    buyAll.simulate('click');

    expectOrderToBeBought(app, mocks.orders.multiple, done);
  };

  const selectProminent = app => {
    expect(app.find('Footer').length).toBe(1);

    const prominent = app.find('LinkButton[children="Prominent"]');
    expect(prominent.length).toBe(1);

    // https://github.com/airbnb/enzyme/issues/516
    prominent.simulate('click', { button: 0 });

    expect(history.location.pathname).toBe('/prominent');
  };

  const selectCommittees = app => {
    expect(app.find('Footer').length).toBe(1);

    const committees = app.find('LinkButton[children="Committees"]');
    expect(committees.length).toBe(1);

    // https://github.com/airbnb/enzyme/issues/516
    committees.simulate('click', { button: 0 });

    expect(history.location.pathname).toBe('/committees');
  };

  const selectNightsWatch = app => {
    expect(app.find('Committee').length).toBe(2);

    app
      .find('Committee')
      .findWhere(n => n.props().children === 'Compucie')
      .simulate('click');

    expect(history.location.pathname).toBe('/committee-members');
  };

  const selectRecent = app => {
    expect(app.find('Footer').length).toBe(1);

    const committees = app.find('LinkButton[children="Recent"]');
    expect(committees.length).toBe(1);

    // https://github.com/airbnb/enzyme/issues/516
    committees.simulate('click', { button: 0 });

    expect(history.location.pathname).toBe('/recent');
  };

  it('allows a member to buy a product', done => {
    selectRangeIncludingJohnSnow(app);

    selectJohnSnow(app);

    addHertogJanToOrder(app);
    expectOrderToBeBought(app, mocks.orders.single, done);
  });

  it('allows buying multiple products', done => {
    selectRangeIncludingJohnSnow(app);
    selectJohnSnow(app);

    // Now enable buying more products
    selectBuyMore(app);
    expectBuyMoreToBeSelected(app);

    // Let's buy some pils
    addHertogJanToOrder(app);
    addHertogJanToOrder(app);
    addHertogJanToOrder(app);

    buyAll(app, done);
  });

  it('is possible to cancel an order', done => {
    selectRangeIncludingJohnSnow(app);

    selectJohnSnow(app);

    addHertogJanToOrder(app);

    const cancelOrder = app => {
      app
        .find('CancelOrder')
        .find('button')
        .simulate('click');
      jest.runAllTimers();

      flushAllPromises()
        .then(() => {
          expect(fetchMock.calls(`${base_api}/orders`, 'post').length).toBe(0);
          expect(app.find('CancelOrder').find('button').length).toBe(0);
        })
        .then(done)
        .catch(e => done.fail(e));
    };

    cancelOrder(app);
  });

  it('is possible to buy products using the prominent list', done => {
    selectProminent(app);
    selectJohnSnow(app);

    addHertogJanToOrder(app);
    expectOrderToBeBought(app, mocks.orders.single, done);
  });

  it('is possible to buy products using the committees list', done => {
    selectCommittees(app);
    selectNightsWatch(app);
    selectJohnSnow(app);

    addHertogJanToOrder(app);
    expectOrderToBeBought(app, mocks.orders.single, done);
  });

  it('is possible to buy products using the recent list', done => {
    const member = {
      id: 314,
      firstName: 'John',
      surname: 'Snow',
      age: 18,
      prominent: null,
      cosmetics: {
        color: '',
        image: 'xtCWQ7vaLKJdSndU1hlv.jpg',
        nickname: '',
        button: {
          width: 0,
          height: 0
        }
      }
    };

    const product = {
      id: 3,
      name: 'Hertog Jan',
      price: 68,
      position: 1,
      category: 'Bier',
      image: 'wCwnyLXTVdPEnKRXjw9I.png',
      age_restriction: 18,
      ordered: 0
    };

    const order = { products: [product] };

    store.dispatch({ type: TYPES.BUY_ORDER_REQUEST, member, order });
    store.dispatch({ type: TYPES.BUY_ORDER_SUCCESS, member, order });

    selectRecent(app);
    selectJohnSnow(app);

    addHertogJanToOrder(app);
    expectOrderToBeBought(app, mocks.orders.single, done);
  });

  it('shows a splashscreen when buying specific products', done => {
    selectRangeIncludingJohnSnow(app);

    selectJohnSnow(app);

    addHertogJanToOrder(app);
    const splash = 'Uo6qQC4Hm8TUqyNjw2G4.jpg';

    expect(app.find('App').props().background).toBe(splash);
    expectOrderToBeBought(app, mocks.orders.single, done);
  });

  it('is possible select members through the compucie screen', done => {
    const selectCompucie = app => {
      app
        .find('Header')
        .find('h1')
        .simulate('click');
      expect(history.location.pathname).toBe('/compucie');
    };

    selectCompucie(app);
    selectJohnSnow(app);

    addHertogJanToOrder(app);
    expectOrderToBeBought(app, mocks.orders.single, done);
  });

  // Redirects
  // Shows a list of transactions

  // Shows error messages when things go wrong

  // Keeps track of all transactions that went wrong

  // Retries transactions
});

const mocks = {
  members: [
    {
      id: 314,
      voornaam: 'John',
      initialen: '',
      tussenvoegsel: '',
      achternaam: 'Snow',
      geboortedatum: '1993-04-26',
      prominent: null,
      kleur: null,
      afbeelding: null,
      bijnaam: null,
      button_width: null,
      button_height: null
    }
  ],

  products: [
    {
      id: 1,
      naam: 'Hertog Jan',
      prijs: '0.6500',
      categorie: 'Bier',
      positie: 999,
      beschikbaar: 1,
      afbeelding: 'Uo6qQC4Hm8TUqyNjw2G4.jpg',
      splash_afbeelding: 'Uo6qQC4Hm8TUqyNjw2G4.jpg',
      kleur: null
    },
    {
      id: 3,
      naam: 'Grolsch',
      prijs: '0.6500',
      categorie: 'Eten',
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
      categorie: 'Fris',
      positie: 999,
      beschikbaar: 0,
      afbeelding: '',
      splash_afbeelding: null,
      kleur: null
    }
  ],

  orders: {
    single: {
      member: {
        id: 314,
        firstName: 'John',
        surname: 'Snow'
      },
      order: {
        products: [
          {
            id: 1,
            name: 'Hertog Jan',
            price: 65
          }
        ]
      }
    },
    multiple: {
      member: {
        id: 314,
        firstName: 'John',
        surname: 'Snow'
      },
      order: {
        products: [
          {
            id: 1,
            name: 'Hertog Jan',
            price: 65
          },
          {
            id: 1,
            name: 'Hertog Jan',
            price: 65
          },
          {
            id: 1,
            name: 'Hertog Jan',
            price: 65
          }
        ]
      }
    }
  },

  committees: [
    {
      commissie_id: 14,
      lid_id: 314,
      jaar: 2018,
      functie: 'King',
      naam: "Night's Watch"
    },
    {
      commissie_id: 0,
      lid_id: 314,
      jaar: 2018,
      functie: 'King',
      naam: 'Compucie'
    }
  ],
  boards: [{ lid_id: 314, jaar: 2018, functie: 'King' }]
};
