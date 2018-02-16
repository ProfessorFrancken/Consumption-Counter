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
}

const defaultRanges = {
  members_per_range: 6 * 5,
  ranges: [

  ]
}

const SETTINGS_TYPES = {
  SET_MEMBERS_PER_RANGE: 'SET_MEMBERS_PER_RANGE'
}

export function surnameRanges(state = defaultRanges, action) {
  switch (action.type) {
    case SETTINGS_TYPES.SET_MEMBERS_PER_RANGE:
      return {
        members_per_range: action.members_per_range,
        ranges: state.ranges,
      }
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
    case TYPES.SELECT_SURNAME_RANGE:
      return { members: action.range.members }
      case TYPES.GO_BACK:
        return { members: [] };
    default:
      return state
  }
}

export function selectedMember(state = null, action) {
  switch (action.type) {
      case TYPES.SELECT_MEMBER:
        return action.member
      case TYPES.GO_BACK:
        return null;
      default:
        return state;
  }
}

export function title(state = "T.F.V. 'Professor Francken'", action) {
  switch (action.type) {
      case TYPES.SELECT_MEMBER:
        return `${action.member.firstName} ${action.member.surname}`
      case TYPES.GO_BACK:
        return "T.F.V. 'Professor Francken'";
      default:
        return state;
  }
}

export function buyMore(state = false, action) {
  switch (action.type) {
      case TYPES.BUY_MORE:
         return ! state;
      case TYPES.GO_BACK:
        return false;
      default:
        return state;
  }
}

export function screen(state, action) {

}
