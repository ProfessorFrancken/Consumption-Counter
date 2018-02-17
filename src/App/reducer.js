import { TYPES } from './../actions'
import { sortBy, groupBy, chunk, first, last, take } from 'lodash'

export function products(state = [], action) {
  switch (action.type) {
      case TYPES.FETCH_PRODUCTS_SUCCESS:
      return groupBy(
        sortBy(action.products, (product) => product.position),
        (product) => product.category
      )
      default:
          return state;
  }
}

export function members(state = [], action) {
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
      case TYPES.BUY_ORDER_SUCCESS:
      case TYPES.BUY_ORDER_FAILURE:
      case TYPES.GO_BACK:
        return { members: [] };
    default:
      return state
  }
}

export function selectedMember(state = { age: 0 }, action) {
  switch (action.type) {
      case TYPES.SELECT_MEMBER:
        return action.member
      case TYPES.BUY_ORDER_SUCCESS:
      case TYPES.BUY_ORDER_FAILURE:
      case TYPES.GO_BACK:
        return { age: 0 };
      default:
        return state;
  }
}

export function title(state = "T.F.V. 'Professor Francken'", action) {
  switch (action.type) {
      case TYPES.SELECT_MEMBER:
        return `${action.member.firstName} ${action.member.surname}`
      case TYPES.BUY_ORDER_SUCCESS:
      case TYPES.BUY_ORDER_FAILURE:
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
      case TYPES.BUY_ORDER_SUCCESS:
      case TYPES.BUY_ORDER_FAILURE:
      case TYPES.GO_BACK:
        return false;
      default:
        return state;
  }
}

const defaultOrder = {
  cancellable: false,
  member: undefined,
  products: []
}
export function order(state = defaultOrder, action) {
  switch (action.type) {
      case TYPES.ADD_PRODUCT_TO_ORDER:
      return {
        ...state,
        products: [
          ...state.products,
          { ...action.product }
        ]
      }
      case TYPES.SELECT_MEMBER:
      case TYPES.BUY_ORDER_REQUEST:
      case TYPES.BUY_ORDER_SUCCESS:
      case TYPES.BUY_ORDER_FAILURE:
      default: return state
  }
}

const KEEP_TRACK_OF_N_TRANSCACTIONS = 10
export function transactions(state = [], action) {
  switch (action.type) {
      case TYPES.BUY_ORDER_SUCCESS:
      return take([
        { member: action.member, order: action.order },
        ...state,
      ], KEEP_TRACK_OF_N_TRANSCACTIONS);
      default:
        return state;
  }
}

export function screen(state, action) {

}
