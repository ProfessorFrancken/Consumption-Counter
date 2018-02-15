import api from './api.js'
import { orderBy, take } from 'lodash'
import { push } from "react-router-redux";

export const actions = {
  addProductToOrder,
  selectRangeOfSurnames,
  selectMember,

  fetchInitialData,
}

export const TYPES = {
  ADD_PRODUCT_TO_ORDER: 'ADD_PRODUCT_TO_ORDER',

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
    const { selectedMember } = getState();

    dispatch({
      type: TYPES.ADD_PRODUCT_TO_ORDER,
      product,
      member: selectedMember
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
          nickname: lid.nickname,
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

export default actions;
