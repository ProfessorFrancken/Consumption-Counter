import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Header from './Header';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';

it('renders a buy more button when visiting the products page', () => {
  const mockStore = configureMockStore([]);
  const store = mockStore({ order: { buyMore: false }, queuedOrder: null });
  const header = mount(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/products']}>
        <Header />
      </MemoryRouter>
    </Provider>
  );
});
