import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { actions, TYPES } from './actions'
import fetchMock from 'fetch-mock'
import expect from 'expect' // You can use any testing library
import { push } from "react-router-redux";

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const api = process.env.REACT_APP_API_SERVER;

describe('Fetching initial data', () => {
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })

  it('Fetches members and products', (done) => {
    fetchMock
      .mock(`${api}/members`, { body: { members: [] }, headers: { 'content-type': 'application/json' } })
      .mock(`${api}/products`, { body: { products: [] }, headers: { 'content-type': 'application/json' } })


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

describe('fetching products', () => {
  xit('maps products from an http request', () => {
  })
})

describe('selecing a member', () => {
  it('should first select a range of surnames', () => {
    const store = mockStore({ })

    store.dispatch(
      actions.selectRangeOfSurnames(
        { range: [], surname_start: 'A', surname_end: 'B'}
      )
    )

    expect(store.getActions()).toEqual([
      push('/members'),
      {
        type: TYPES.SELECT_SURNAME_RANGE,
        range: { range: [], surname_start: 'A', surname_end: 'B'}
      }
    ])
  })

  it('should select a member from a range of members', () => {
    const store = mockStore({ })
    const member = {
      id: 1,
      firstName: 'John',
      surname: 'Snow',
      age: 18,
      prominent: 0,

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

    store.dispatch(actions.selectMember(member))


    expect(store.getActions()).toEqual([
      push('/products'),
      {
        type: TYPES.SELECT_MEMBER,
        member
      }
    ])

  })
})

describe('cancelling', () => {
  it('can cancel any selecion by going back', () => {
    const store = mockStore({ })

    store.dispatch(
      actions.goBack()
    )

    expect(store.getActions()).toEqual([
      push('/'),
      { type: TYPES.GO_BACK }
    ])
  })
})

describe('buying products', () => {

  it('is possible to toggle buying more products', () => {
    expect(actions.buyMore()).toEqual({ type: TYPES.BUY_MORE })
  })

  it('buys products', () => {
    // TODO couple buy all button to ui
  })

  it('does not inmediadly buy an order when buying multiple products', () => {
    // when a member is selected and we buy multiple products
    const member = { id: 1 }
    const store = mockStore({ selectedMember: member, buyMore: true })

    // and when adding a product to order
    const product = { id: 2 }
    store.dispatch(actions.addProductToOrder(product))

    // then we buy a product
    expect(store.getActions()).toEqual([
      { type: TYPES.ADD_PRODUCT_TO_ORDER, member, product },
    ])
  })

  it('buys an order after adding 1 product to an order', (done) => {
    // when a member is selected
    // and we only buy one product
    const member = { id: 1 }
    const store = mockStore({ selectedMember: member, buyMore: false })

    fetchMock
      .mock(`${api}/orders`, { body: {}, headers: { 'content-type': 'application/json' } })

    // and when adding a product to order
    const product = { id: 2 }
    store.dispatch(actions.addProductToOrder(product))
         .then(() => {
           // then we buy a product
           expect(store.getActions()).toEqual([
             { type: TYPES.BUY_ORDER_REQUEST, member, order: { products: [product] } },
             { type: TYPES.BUY_ORDER_SUCCESS, member, order: { products: [product] } },
             push('/'),
           ])
           done()
         })
         .catch((e) => done.fail(e))
  })

  xit('waits a few seconds before buying an order so that a member can cancel its order', () => {

  })

})
