import React from 'react';
import CancelOrder from './index';
import configureMockStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { TYPES } from './../../actions';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

describe('<CancelOrder>', () => {
  it('cancels orders', () => {
    const mockStore = configureMockStore([thunk]);

    const member = { id: 2, firstName: 'John', surname: 'Snow' };
    const products = [{ id: 1, price: 100, name: 'Pils' }];
    const store = mockStore({
      queuedOrder: {
        order: { products, member, ordered_at: 1 },
        ordered_at: 1
      }
    });
    const cancel = mount(
      <Provider store={store}>
        <CancelOrder />
      </Provider>
    );

    cancel.find('button').simulate('click');

    expect(cancel.find('button').text()).toEqual(
      'Cancel buying Pils for €1.00'
    );

    expect(store.getActions()).toEqual([
      {
        type: TYPES.CANCEL_ORDER,
        order: { products, member, ordered_at: 1 }
      }
    ]);
  });

  it('does not show all products when buying multiple products', () => {
    const mockStore = configureMockStore([thunk]);

    const member = { id: 2, firstName: 'John', surname: 'Snow' };
    const products = [
      { id: 1, price: 100, name: 'Pils' },
      { id: 2, price: 100, name: 'Kinder bueno' }
    ];
    const store = mockStore({
      queuedOrder: {
        order: { products, member, ordered_at: 1 },
        ordered_at: 1
      }
    });
    const cancel = mount(
      <Provider store={store}>
        <CancelOrder />
      </Provider>
    );

    cancel.find('button').simulate('click');

    expect(cancel.find('button').text()).toEqual(
      'Cancel buying multiple products for €2.00'
    );

    expect(store.getActions()).toEqual([
      {
        type: TYPES.CANCEL_ORDER,
        order: { products, member, ordered_at: 1 }
      }
    ]);
  });

  it("it isn't shown when no order is queud", () => {
    const mockStore = configureMockStore([thunk]);
    const store = mockStore({ queuedOrder: null });
    const cancel = mount(
      <Provider store={store}>
        <CancelOrder />
      </Provider>
    );

    expect(cancel.find('button').length).toBe(0);
  });
});
