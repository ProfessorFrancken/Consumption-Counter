import React from 'react';
import BuyMore from './BuyMore';
import BuyMoreContainer from './BuyMoreContainer';
import { mount } from 'enzyme';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

describe('Buy more component', () => {
  it('renders a toggle option to select more products', () => {
    const buyMore = mount(
      <BuyMore
        buyMore={false}
        selectedMultipleProducts={false}
        buyAll={jest.fn()}
        toggle={jest.fn()}
      />
    );

    expect(buyMore.find('input').length).toBe(1);
  });

  it('renders a buy all button', () => {
    const buyMore = mount(
      <BuyMore
        buyMore={true}
        selectedMultipleProducts={true}
        buyAll={jest.fn()}
        toggle={jest.fn()}
      />
    );

    expect(buyMore.find('button').length).toBe(1);
  });
});

it('does not show a buy all button if no products were selected', () => {
  const mockStore = configureMockStore();

  const store = mockStore({
    buyMore: true,
    order: {
      products: []
    }
  });
  const buyMore = shallow(<BuyMoreContainer store={store} />);

  expect(buyMore.props().selectedMultipleProducts).toBe(false);
});

it('shows a button if multiple products were added to an order', () => {
  const mockStore = configureMockStore();

  const store = mockStore({
    buyMore: true,
    order: {
      products: [{ id: 1 }]
    }
  });
  const buyMore = shallow(<BuyMoreContainer store={store} />);

  expect(buyMore.props().selectedMultipleProducts).toBe(true);
});
