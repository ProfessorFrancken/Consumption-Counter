export const actions = {
  addProductToOrder,
  selectMember,

  fetchInitialData,
}

export const TYPES = {
  ADD_PRODUCT_TO_ORDER: 'ADD_PRODUCT_TO_ORDER',

  SELECT_MEMBER: 'SELECT_MEMBER',

  FETCH_MEMBERS_REQUEST: 'FETCH_MEMBERS_REQUEST',
  FETCH_MEMBERS_SUCCESS: 'FETCH_MEMBERS_SUCCESS',
  FETCH_MEMBERS_FAILURE: 'FETCH_MEMBERS_FAILURE',

  FETCH_PRODUCTS_REQUEST: 'FETCH_PRODUCTS_REQUEST',
  FETCH_PRODUCTS_SUCCESS: 'FETCH_PRODUCTS_SUCCESS',
  FETCH_PRODUCTS_FAILURE: 'FETCH_PRODUCTS_FAILURE',
}

/**
 * TODO: currently we only have an option for adding products to
 * an order, however it should be possible to either add and buy, or
 * add multiple products and buy manually
 */
export function addProductToOrder(product) {
  return (dispatch, getState) => {
    const { selected_member } = getState();

    dispatch({
      type: TYPES.ADD_PRODUCT_TO_ORDER,
      product,
      member: selected_member
    })
  }
}

export function selectMember(member) {
  return {
    type: TYPES.SELECT_MEMBER,
    member
  }
}

function fetchMembers() {
  return (dispatch) => {
    dispatch({
      type: TYPES.FETCH_MEMBERS_REQUEST
    })

    dispatch({
      type: TYPES.FETCH_MEMBERS_SUCCESS,
      members: []
    })
  }
}

function fetchProducts() {
  return (dispatch) => {
    dispatch({
      type: TYPES.FETCH_PRODUCTS_REQUEST
    })

    dispatch({
      type: TYPES.FETCH_PRODUCTS_SUCCESS,
      products: []
    })
  }
}

export function fetchInitialData() {
  return (dispatch) => {
    dispatch(fetchMembers())
    dispatch(fetchProducts())
  }
}

export default actions;
