import { products as defaultProductsState, members as defaultMembersState } from './default_data.js'
import { TYPES } from './../actions'
import { groupBy } from 'lodash'

export function products(state = defaultProductsState, action) {
  switch (action.type) {
      default:
          return state;
  }
}

export function members(state = defaultMembersState, action) {
  console.log("Getting members?")
  switch (action.type) {
    case TYPES.FETCH_MEMBERS_SUCCESS:
      return action.members
    default:
      return state
  }

  return state;
}

export function surnameSelection(state = [], action) {
  switch (action.type) {
    case TYPES.FETCH_MEMBERS_SUCCESS:
      return action.members
    default:
      return state
  }

  return state;
}

export function selected_member(state, action) {
  return {
    id: 1,
    fullName: 'Mark Redeman',
    age: 19
  }
}

export function title(state, action) {
  return "T.F.V. 'Professor Francken'"
}
