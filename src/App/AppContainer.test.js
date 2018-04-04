import React from 'react';
import { mount } from 'enzyme';
import AppContainer from './AppContainer';
import fetchMock from 'fetch-mock';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { create, history } from './../Setup/store';
import { TYPES } from './../actions';
import MockDate from 'mockdate';

describe('Plus One', () => {
  let store, app;
  const base_api = process.env.REACT_APP_API_SERVER;

  // https://hackernoon.com/low-effort-high-value-integration-tests-in-redux-apps-d3a590bd9fd5
  const flushAllPromises = () => new Promise(resolve => setImmediate(resolve));

  beforeEach(() => {
    MockDate.set(new Date(1514764800000));

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
      .mock(`${base_api}/orders`, {})
      .mock(`https://borrelcie.vodka/chwazorcle/hoeveel.php`, {
        body: { committees: mocks.committees },
        headers: { 'content-type': 'application/json' }
      });

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
    MockDate.reset();
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
      .findWhere(c => {
        if (c.length === 0) {
          return false;
        }

        const { product } = c.props();

        return product !== undefined && product.id === 1;
      })
      .first();

    hertogJanButton.simulate('mouseDown').simulate('mouseUp');
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
    const hertogJanButton = app
      .find('Product')
      .findWhere(c => {
        if (c.length === 0) {
          return false;
        }

        const { product } = c.props();

        return product !== undefined && product.id === 1;
      })
      .first();

    // Long press the product to select more of it
    hertogJanButton.simulate('mouseDown');
    jest.runTimersToTime(1000);
    hertogJanButton.simulate('mouseUp');
  };

  const expectBuyMoreToBeSelected = app => {
    expect(app.find('BuyAll').length).toBe(1);
  };

  const buyAll = (app, done) => {
    expect(app.find('BuyAll').find('button').length).toBe(1);
    const buyAll = app
      .find('BuyAll')
      .find('button')
      .first();
    buyAll.simulate('click');

    expectOrderToBeBought(app, mocks.orders.multiple, done);
  };

  const selectProminent = app => {
    expect(app.find('Footer').length).toBe(1);

    const prominent = app.find('NavLink[to="/prominent"]');
    expect(prominent.length).toBe(1);

    // https://github.com/airbnb/enzyme/issues/516
    prominent.simulate('click', { button: 0 });

    expect(history.location.pathname).toBe('/prominent');
  };

  const selectCommittees = app => {
    expect(app.find('Footer').length).toBe(1);

    const committees = app.find('NavLink[to="/committees"]');
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

    expect(history.location.pathname).toBe('/committees/0');
  };

  const selectRecent = app => {
    expect(app.find('Footer').length).toBe(1);

    const committees = app.find('NavLink[to="/recent"]');
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
      fullname: 'John Snow',
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

    const order = { products: [product], ordered_at: 1, member };

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

    expect(
      app
        .find(`App`)
        .first()
        .props().background
    ).toBe(splash);
    expectOrderToBeBought(app, mocks.orders.single, done);
  });

  it('is possible select members through the compucie screen', done => {
    const selectCompucie = app => {
      app
        .find('Header')
        .find('.association')
        .simulate('click');

      expect(history.location.pathname).toBe('/compucie');
    };

    selectCompucie(app);
    selectJohnSnow(app.find('.compucie').first());

    addHertogJanToOrder(app);
    expectOrderToBeBought(app, mocks.orders.single, done);
  });

  // This test checks if we don't have any async issues
  it('it is possible to buy a product after someone else has bought a product', done => {
    selectRangeIncludingJohnSnow(app);

    selectJohnSnow(app);

    addHertogJanToOrder(app);

    const selectOtherMemberAfterBuying = (app, expectedOrder, done) => {
      // The cancel button should be shown until the timeout is run
      expect(app.find('CancelOrder').find('button').length).toBe(1);

      selectRangeIncludingJohnSnow(app);
      selectJohnSnow(app);

      jest.runTimersToTime(10000);

      flushAllPromises()
        .then(() => {
          addHertogJanToOrder(app);

          expect(fetchMock.calls(`${base_api}/orders`, 'post').length).toBe(1);
          const calls = fetchMock.lastCall(`${base_api}/orders`, 'post');

          expect(JSON.parse(calls[1].body)).toEqual(expectedOrder);
          expect(app.find('CancelOrder').find('button').length).toBe(1);

          jest.runTimersToTime(10000);

          flushAllPromises()
            .then(() => {
              expect(fetchMock.calls(`${base_api}/orders`, 'post').length).toBe(
                2
              );
              const calls = fetchMock.lastCall(`${base_api}/orders`, 'post');

              expect(JSON.parse(calls[1].body)).toEqual(expectedOrder);
              done();
            })
            .catch(e => {
              done.fail(e);
            });
        })
        .catch(e => {
          done.fail(e);
        });
    };

    selectOtherMemberAfterBuying(app, mocks.orders.single, done);
  });
  // Redirects
  // Shows a list of transactions

  // Shows error messages when things go wrong

  // Keeps track of all transactions that went wrong

  // Retries transactions

  it("does allows cancelling an order after an other order's timeout was handled", done => {
    const cancelOrder = app => {
      flushAllPromises()
        .then(() => {
          app.update();

          app
            .find('CancelOrder')
            .find('button')
            .simulate('click');

          expect(fetchMock.calls(`${base_api}/orders`, 'post').length).toBe(1);
          expect(app.find('CancelOrder').find('button').length).toBe(0);
        })
        .then(done)
        .catch(e => done.fail(e));
    };

    selectRangeIncludingJohnSnow(app);
    selectJohnSnow(app);
    addHertogJanToOrder(app);

    // Run time forward a little so that the timeout of the first orders
    // does not occur on the same time as the second
    jest.runTimersToTime(4000);

    MockDate.set(new Date(1514764800000 + 4000));
    selectRangeIncludingJohnSnow(app);
    selectJohnSnow(app);
    addHertogJanToOrder(app);

    // Run the first timeout
    jest.runTimersToTime(4000);
    cancelOrder(app);
  });

  describe('when the system is idle for a specific time', () => {
    it('goes back to the main screen after 30 seconds', () => {
      selectRangeIncludingJohnSnow(app);
      jest.runTimersToTime(30000);
      expect(history.location.pathname).toBe('/');
    });

    it('should reset the screensaver timer when going to a different route', () => {
      selectRangeIncludingJohnSnow(app);
      jest.runTimersToTime(20000);
      selectRecent(app);
      jest.runTimersToTime(20000);
      expect(history.location.pathname).toBe('/recent');
      jest.runTimersToTime(10000);
      expect(history.location.pathname).toBe('/');
    });
  });
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
      order: {
        member: {
          id: 314,
          firstName: 'John',
          surname: 'Snow'
        },
        products: [
          {
            id: 1,
            name: 'Hertog Jan',
            price: 65
          }
        ],
        ordered_at: 1514764800000
      }
    },
    multiple: {
      order: {
        member: {
          id: 314,
          firstName: 'John',
          surname: 'Snow'
        },
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
        ],
        ordered_at: 1514764800000
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
