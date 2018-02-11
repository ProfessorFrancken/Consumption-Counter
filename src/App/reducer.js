import { products as defaultProductsState, members as defaultMembersState } from './default_data.js'

export function products(state = defaultProductsState, action) {
  switch (action.type) {
      default:
          return state;
  }
}

export function members(state = defaultMembersState, action) {
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
