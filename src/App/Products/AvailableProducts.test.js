import React from 'react';
import AvailableProducts from './AvailableProducts.js';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';

it('renders', () => {
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
    order: { member: { age: 17 } }
  });
  const products = shallow(<AvailableProducts store={store} />);

  expect(products.props().products.Bier.length).toBe(0);
  expect(products.props().products.Fris.length).toBe(1);
});
