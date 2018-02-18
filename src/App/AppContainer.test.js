import React from 'react';
import { mount } from 'enzyme'
import AppContainer from './AppContainer'
import fetchMock from 'fetch-mock'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './../Setup/store'
import { history } from './../Setup/store'


describe('Plus One', () => {
  const base_api = process.env.REACT_APP_API_SERVER;

  beforeEach(() => {
    fetchMock.mock(`${base_api}/members`, {
        body: { members: mocks.members  },
        headers: { 'content-type': 'application/json' }
      })
      .mock(`${base_api}/products`, {
        body: { products: mocks.products },
        headers: { 'content-type': 'application/json' }
      })
  })
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })

  const afterPromise = (done, fn) => (
    setTimeout(function () {
      try {
        fn();
        done();
      } catch(e) {
        done.fail(e);
      }
    }, 0)
  )

  const selectRangeIncludingJohnSnow = (app) => {
    expect(app.find('SurnameRanges').length).toBe(1)
    expect(app.find('SurnameRanges').find('button').length).toBe(1)
    const selectJohn = app.find('SurnameRanges').find('button')
    selectJohn.simulate('click')
  }

  const selectJohnSnow = (app) => {
    expect(history.location.pathname).toBe('/members')
    expect(app.find('Members').length).toBe(1)
    app.find('Members').find('button').simulate('click')
  }

  const addHertogJanToOrder = (app) => {
    expect(history.location.pathname).toBe('/products')
    expect(app.find('Product').length).toBe(3)
    expect(app.find('Product').find('button').length).toBe(3)

    const hertogJanButton = app.find('Product').find('button').first()
    hertogJanButton.simulate('click')
  }

  const expectOrderToBeBought = (app, expectedOrder) => {
    expect(fetchMock.calls(`${base_api}/orders`, 'post').length).toBe(1)
    const calls = fetchMock.lastCall(`${base_api}/orders`, 'post')

    expect(calls[1].body).toEqual(JSON.stringify(expectedOrder))
  }

  it('allows a member to buy a product', (done) => {
    fetchMock.mock(`${base_api}/orders`, {})

    const app = mount(
      <Provider store={store}>
        <Router history={history}>
          <AppContainer />
        </Router>
      </Provider>
    )

    afterPromise(done, () => {
      // Not sure why, but we need to manually update our app in order
      // for app.find() to work correclty (otherwise we get an timeout exception)
      app.update()

      selectRangeIncludingJohnSnow(app)

      selectJohnSnow(app)

      addHertogJanToOrder(app)
      expectOrderToBeBought(app, mocks.orders.single)
    })
  })

  it('allows buying multiple products', (done) => {
    fetchMock.mock(`${base_api}/orders`, {})

    const app = mount(
      <Provider store={store}>
        <Router history={history}>
          <AppContainer />
        </Router>
      </Provider>
    )

    const selectBuyMore = (app) => {
      expect(app.find('BuyMore').find('input').length).toBe(1)
      const select = app.find('BuyMore').find('input').first()
      expect(select.props().checked).toBeFalsy();
      select.simulate('change')
    }

    const expectBuyMoreToBeSelected = (app) => {
      const select = app.find('BuyMore').find('input').first()
      expect(select.props().checked).toBeTruthy();
    }

    const buyAll = (app) => {
      expect(app.find('BuyMore').find('button').length).toBe(1)
      const buyAll = app.find('BuyMore').find('button').first()
      buyAll.simulate('click')

      expectOrderToBeBought(app, mocks.orders.multiple)
    }

    afterPromise(done, () => {
        // Not sure why, but we need to manually update our app in order
        // for app.find() to work correclty (otherwise we get an timeout exception)
        app.update()

        selectRangeIncludingJohnSnow(app)
        selectJohnSnow(app)

        // Now enable buying more products
        selectBuyMore(app)
        expectBuyMoreToBeSelected(app)

        // Let's buy some pils
        addHertogJanToOrder(app)
        addHertogJanToOrder(app)
        addHertogJanToOrder(app)

        buyAll(app)
    })
  })

  // Redirects
  // Shows a list of transactions
})

const mocks = {
  members:[
    {
      "id":314,
      "voornaam":"John",
      "initialen":"",
      "tussenvoegsel":"",
      "achternaam":"Snow",
      "geboortedatum": "26-04-1993",
      "prominent":null,
      "kleur":null,
      "afbeelding":null,
      "bijnaam":null,
      "button_width":null,
      "button_height":null
    },
  ],

  products: [
    {
      "id":1,
      "naam":"Hertog Jan",
      "prijs":"0.6500",
      "categorie":"Bier",
      "positie":999,
      "beschikbaar":1,
      "afbeelding":"Uo6qQC4Hm8TUqyNjw2G4.jpg",
      "splash_afbeelding":null,
      "kleur":null
    },
    {
      "id":3,
      "naam":"Grolsch",
      "prijs":"0.6500",
      "categorie":"Eten",
      "positie":999,
      "beschikbaar":1,
      "afbeelding":"Uo6qQC4Hm8TUqyNjw2G4.jpg",
      "splash_afbeelding":null,
      "kleur":null
    },
    {
      "id":2,
      "naam":"Heineken",
      "prijs":"0.6000",
      "categorie":"Fris",
      "positie":999,
      "beschikbaar":0,
      "afbeelding":"",
      "splash_afbeelding":null,
      "kleur":null
    }
  ],

  orders: {
    single: {
      member: {
        id: 314,
        firstName: "John",
        surname: "Snow",
        age: 18,
        prominent: null,
        cosmetics: {color: null, image: null, nickname: null, button: {width: null, height: null}}
      },
      order: {
        products: [
          {
            id: 1,
            name: "Hertog Jan",
            price: 65,
            position: 999,
            category: "Bier",
            image: "Uo6qQC4Hm8TUqyNjw2G4.jpg",
            age_restriction: 18
          }
        ]
      }
    },
    multiple: {
      order: {
        cancellable: false,
        products: [
          {
            id: 1,
            name: "Hertog Jan",
            price: 65,
            position: 999,
            category: "Bier",
            image: "Uo6qQC4Hm8TUqyNjw2G4.jpg",
            age_restriction: 18
          },
          {
            id: 1,
            name: "Hertog Jan",
            price: 65,
            position: 999,
            category: "Bier",
            image: "Uo6qQC4Hm8TUqyNjw2G4.jpg",
            age_restriction: 18
          },
          {
            id: 1,
            name: "Hertog Jan",
            price: 65,
            position: 999,
            category: "Bier",
            image: "Uo6qQC4Hm8TUqyNjw2G4.jpg",
            age_restriction: 18
          }
        ]
      }

    }
  }
}
