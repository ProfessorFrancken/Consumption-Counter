import React from 'react';
import configureMockStore from 'redux-mock-store'
import { shallow, mount } from 'enzyme'
import thunk from 'redux-thunk'
import AppContainer from './AppContainer'

import fetchMock from 'fetch-mock'
import { routerMiddleware } from "react-router-redux";
import createHistory from "history/createBrowserHistory";
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import stores from './../Setup/store'

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

  fit('allows a member to buy a product', (done) => {

  fetchMock
    .mock(`${base_api}/members`, { body: { members: [] }, headers: { 'content-type': 'application/json' } })
    .mock(`${base_api}/products`, { body: { products: [] }, headers: { 'content-type': 'application/json' } })

  const app = mount(
    <Provider store={stores}>
      <MemoryRouter>
        <AppContainer />
      </MemoryRouter>
    </Provider>
  )
  /* console.log(stores.getState());*/
  /* console.log(app.html())*/

    setTimeout(() => {
      console.log("moi moi moi", app.html())
      expect(2).toBe(1)
      done()
    }, 5000)



  /* console.log(app.children())
   * console.log(app.find('Range'));

   * console.log(app.html())
   * console.log(stores)*/

})
})