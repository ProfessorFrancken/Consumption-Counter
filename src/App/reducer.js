import producten from './../assets/products.json'
import { sortBy, groupBy } from 'lodash'
import faker from 'faker'

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

faker.seed(123)
const defaultMembers = sortBy(
  [...Array(6 * 7).keys()].map((idx) => {
    const surname = faker.name.lastName();
    const firstName = faker.name.firstName();
    return {
      firstName,
      surname,
      fullName: `${firstName} ${surname} ${surname}`,
      id: idx,
      birthday: undefined,
      cosmetics: undefined
    }
  }),
  (member) => member.surname
);
console.log(defaultMembers)
export function members(state = defaultMembers, action) {
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
  return "Mark Redeman"
  return "T.F.V. 'Professor Francken'"
}
