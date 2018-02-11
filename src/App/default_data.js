import producten from './../assets/products.json'
import { sortBy, groupBy } from 'lodash'
import faker from 'faker'

faker.seed(123)

export const products = groupBy(
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

export const members = sortBy(
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
