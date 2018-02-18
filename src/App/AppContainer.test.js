import React from 'react';
import configureMockStore from 'redux-mock-store'
import { shallow, mount } from 'enzyme'
import thunk from 'redux-thunk'
import AppContainer from './AppContainer'

import fetchMock from 'fetch-mock'
import { routerMiddleware } from "react-router-redux";
import { createHistory } from "history/createBrowserHistory";
import { createMemoryHistory } from "history";
import { Router as MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import stores from './../Setup/store'
import { push } from "react-router-redux";

import { history } from './../Setup/store'

const base_api = process.env.REACT_APP_API_SERVER;

it('renders', () => {
  const api = {
    get: jest.fn(),
    post: jest.fn()
  }

  const mockStore = configureMockStore([thunk.withExtraArgument(api)]);

  const store = mockStore({ });
  const app = shallow(
    <AppContainer store={store}/>
  )
})

describe('Plus One', () => {
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })

  it('allows a member to buy a product', (done) => {

    fetchMock
      .mock(`${base_api}/members`, { body: { members: [
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
      ] }, headers: { 'content-type': 'application/json' } })
      .mock(`${base_api}/products`, { body: { products: [
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
      ] }, headers: { 'content-type': 'application/json' } })
      .mock(`${base_api}/orders`, { body: { members: []}})

    const app = mount(
      <Provider store={stores}>
        <MemoryRouter history={history}>
          <AppContainer />
        </MemoryRouter>
      </Provider>
    )
    setTimeout(() => {
      app.update()
      const selectJohn = app.find('SurnameRanges').find('button')
      selectJohn.simulate('click')

      setTimeout(() => {
        expect(history.location.pathname).toBe('/members')
        expect(app.find('Members').length).toBe(1)
        app.find('Members').find('button').simulate('click')

        setTimeout(() => {
          expect(history.location.pathname).toBe('/products')
          expect(app.find('Product').length).toBe(3)

          const HertogJanButton = app.find('Product').find('button').first()
          HertogJanButton.simulate('click')
          expect(fetchMock.calls(`${base_api}/orders`, 'post').length).toBe(1)
          done()
        }, 100);
      }, 0)
    }, 0)
  })
})