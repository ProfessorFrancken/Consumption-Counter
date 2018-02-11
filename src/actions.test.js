import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { actions, TYPES } from './actions'
import fetchMock from 'fetch-mock'
import expect from 'expect' // You can use any testing library

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Fetching initial data', () => {
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })

  it('Fetches members and products', (done) => {
    fetchMock
      .mock('http://plus_one.dev/api/members', { body: { members: [] }, headers: { 'content-type': 'application/json' } })
      .mock('http://plus_one.dev/api/products', { body: { products: [] }, headers: { 'content-type': 'application/json' } })


    const expectedActions = [
      { type: TYPES.FETCH_MEMBERS_REQUEST },
      { type: TYPES.FETCH_PRODUCTS_REQUEST },
      { type: TYPES.FETCH_MEMBERS_SUCCESS, members: [] },
      { type: TYPES.FETCH_PRODUCTS_SUCCESS, products: [] },
    ]

    const store = mockStore({ members: [] })

    store.dispatch(actions.fetchInitialData())
         .then(() => {
           /* return of async actions*/
           expect(store.getActions()).toEqual(expectedActions)
           done()
         })
         .catch((e) => done.fail(e))
  })
})
