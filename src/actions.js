import api from './api.js'
import { orderBy, take } from 'lodash'
import { push } from "react-router-redux";

export const actions = {
  goBack,
  buyMore,
  buyOrder,

  addProductToOrder,
  selectRangeOfSurnames,
  selectMember,

  fetchInitialData,
}

export const TYPES = {
  GO_BACK: 'BO_BACK',

  BUY_MORE: 'TOGGLE_BUY_MORE_PRODUCTS',
  ADD_PRODUCT_TO_ORDER: 'ADD_PRODUCT_TO_ORDER',

  BUY_ORDER_REQUEST: 'BUY_ORDER_REQUEST',
  BUY_ORDER_SUCCESS: 'BUY_ORDER_SUCCESS',
  BUY_ORDER_FAILURE: 'BUY_ORDER_FAILURE',

  SELECT_SURNAME_RANGE: 'SELECT_SURNAME_RANGE',
  SELECT_MEMBER: 'SELECT_MEMBER',

  FETCH_MEMBERS_REQUEST: 'FETCH_MEMBERS_REQUEST',
  FETCH_MEMBERS_SUCCESS: 'FETCH_MEMBERS_SUCCESS',
  FETCH_MEMBERS_FAILURE: 'FETCH_MEMBERS_FAILURE',

  FETCH_PRODUCTS_REQUEST: 'FETCH_PRODUCTS_REQUEST',
  FETCH_PRODUCTS_SUCCESS: 'FETCH_PRODUCTS_SUCCESS',
  FETCH_PRODUCTS_FAILURE: 'FETCH_PRODUCTS_FAILURE',
}

export function selectRangeOfSurnames(range) {
  return (dispatch) => {
    dispatch(push('/members'))
    dispatch({
      type: TYPES.SELECT_SURNAME_RANGE,
      range
    })
  }
}

/**
 * TODO: currently we only have an option for adding products to
 * an order, however it should be possible to either add and buy, or
 * add multiple products and buy manually
 */
export function addProductToOrder(product) {
  return (dispatch, getState) => {
    const { selectedMember, buyMore } = getState();

    if (! buyMore) {
      return dispatch(buySingleProduct(selectedMember, product))
    } else {
      dispatch({
        type: TYPES.ADD_PRODUCT_TO_ORDER,
        product,
        member: selectedMember
      })
    }
  }
}

function buySingleProduct(member, product) {
  return buyOrder(member, { products: [product]})
}

export function buyOrder(member, order) {
  return (dispatch) => {

    dispatch({
      type: TYPES.BUY_ORDER_REQUEST,
      member,
      order
    })

    return api.post('/orders', { member, order })
       .then((response) => {
         dispatch({
           type: TYPES.BUY_ORDER_SUCCESS,
           member,
           order
         })
         dispatch(push('/'))
       }).catch((ex) => dispatch({
         type: TYPES.BUY_ORDER_FAILURE,
         member,
         order
       }))
  }
}

export function selectMember(member) {
  return (dispatch) => {
    dispatch(push('/products'))
    dispatch({
      type: TYPES.SELECT_MEMBER,
      member
    })
  }
}

function fetchMembers() {
  return (dispatch) => {
    dispatch({
      type: TYPES.FETCH_MEMBERS_REQUEST
    })

    const calculateAge = (birtday) => 18

    const mapMembers = (lid) => {
      return {
        id: lid.id,
        firstName: lid.voornaam,
        surname: lid.achternaam,
        age: calculateAge(lid.geboortedatum),
        prominent: lid.prominent,

        cosmetics: {
          color: lid.kleur,
          image: lid.afbeelding,
          nickname: lid.bijnaam,
          button: {
            width: lid.button_width,
            height: lid.button_height
          }
        }
      }
    }

    return api.get('/members')
       .then((response) => dispatch({
         type: TYPES.FETCH_MEMBERS_SUCCESS,
         members: orderBy(
           response.members.map(mapMembers),
           (member) => member.surname
         )
       })).catch((ex) => dispatch({
         type: TYPES.FETCH_MEMBERS_FAILUREa
       }))
  }
}

function fetchProducts() {
  return (dispatch) => {
    dispatch({
      type: TYPES.FETCH_PRODUCTS_REQUEST
    })

    return api.get('/products')
       .then((response) => dispatch({
         type: TYPES.FETCH_PRODUCTS_SUCCESS,
         products: response.products
       }))
       .catch((ex) => dispatch({
         type: TYPES.FETCH_PRODUCTS_FAILURE
       }))
  }
}

export function fetchInitialData() {
  return (dispatch) => Promise.all([
      dispatch(fetchMembers()),
      dispatch(fetchProducts())
    ])
}

export function goBack() {
  return (dispatch) => {
    dispatch(push('/'))
    dispatch({ type: TYPES.GO_BACK })
  }
}

export function buyMore() {
  return { type: TYPES.BUY_MORE }
}

export default actions;
