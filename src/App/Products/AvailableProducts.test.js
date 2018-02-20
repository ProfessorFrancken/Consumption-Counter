import React from 'react';
import AvailableProducts from './AvailableProducts.js';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';

it('renders, and it does not include products that a member is not allowed to buy (due to age distriction)', () => {
  const api = {
    post: jest.fn()
  };
  const mockStore = configureMockStore([thunk.withExtraArgument(api)]);

  const store = mockStore({
    products: {
      Bier: [{ name: 'Hertog Jan', image: '', id: 1, age_restriction: 18 }],
      Fris: [{ name: 'Ice Tea', image: '', id: 2, age_restriction: null }],
      Eten: []
    },
    order: { member: { age: 17 }, products: [] }
  });
  const products = shallow(<AvailableProducts store={store} />);

  expect(products.props().products.Bier.length).toBe(0);
  expect(products.props().products.Fris.length).toBe(1);
});

it('shows the amount of products that are currently being orderd', () => {
  const api = {
    post: jest.fn()
  };
  const mockStore = configureMockStore([thunk.withExtraArgument(api)]);

  const store = mockStore({
    products: {
      Bier: [{ name: 'Hertog Jan', image: '', id: 1, age_restriction: 18 }],
      Fris: [{ name: 'Ice Tea', image: '', id: 2, age_restriction: null }],
      Eten: []
    },
    order: {
      member: { age: 19 },
      products: [
        {
          id: 1,
          name: 'Hertog Jan',
          price: 65
        },
        {
          id: 1,
          name: 'Hertog Jan',
          price: 65
        }
      ]
    }
  });

  const products = shallow(<AvailableProducts store={store} />);

  const hertog = products
    .props()
    .products.Bier.find(product => product.id === 1);
  const iceTea = products
    .props()
    .products.Fris.find(product => product.id === 2);

  expect(hertog.ordered).toBe(2);
  expect(iceTea.ordered).toBe(0);
});
