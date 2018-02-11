import producten from './../assets/products.json'
import { sortBy, groupBy } from 'lodash'

const defaultProductsState = groupBy(
  sortBy(
    producten.map(product => {
      return {
        id: product.id,
        name: product.naam,
        price: product.prijs,
        position: product.positie,
        category: product.categorie,
        image: product.afbeelding,
        age_restriction: 18
      }
    }),
    // Important products have a low number, so sort ascending
    (product) => product.positie
  ),
  (product) => product.category
);

export function products(state = defaultProductsState, action) {
  switch (action.type) {
      default:
          return state;
  }
}

export function members(state = {}, action) {
  return state
}

export function selected_member(state, action) {
  return {
    age: 19
  }
}

export function title(state, action) {
  return "Mark Redeman"
  return "T.F.V. 'Professor Francken'"
}
