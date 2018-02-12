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
  switch (action.type) {
    case TYPES.FETCH_MEMBERS_SUCCESS:
      return action.members
    default:
      return state
  }

  return state;
}

const defaultRanges = {
  members_per_range: 6 * 5,
  ranges: [

  ]
}
export function surnameRanges(state = defaultRanges, action) {
  switch (action.type) {
    case TYPES.FETCH_MEMBERS_SUCCESS:
      return {
        members_per_range: state.members_per_range,
        ranges: chunk(
          action.members,
          state.members_per_range
        ).map((range) => {
          const members = range;

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
}

export function selectedMemberRange(state = { members: [] }, action) {
  switch (action.type) {
    case 'SELECT_SURNAME_RANGE':
      return {
        members: action.range.members
      }
    default:
      return state
  }
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
