import { products as defaultProductsState, members as defaultMembersState } from './default_data.js'
import { TYPES } from './../actions'
import { chunk, first, last } from 'lodash'

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

export function surnameRanges(state = { members_per_group: 6 * 8}, action) {
  switch (action.type) {
    case TYPES.FETCH_MEMBERS_SUCCESS:
      return {
        members_per_group: state.members_per_group,
        groups: chunk(
          action.members,
          state.members_per_group
        ).map((group) => {
          const members = group;

          return {
            members,
            surname_start: first(members).surname,
            surname_end: last(members).surname
          }
        })
      }
    default:
      return state
  }

  return state;
}

export function selectedMember(state, action) {
  return {
    id: 1,
    fullName: 'Mark Redeman',
    age: 19
  }
}

export function title(state, action) {
  return "T.F.V. 'Professor Francken'"
}
