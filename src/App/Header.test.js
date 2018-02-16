import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import Header from './Header';
import { mount } from 'enzyme'
import configureMockStore from 'redux-mock-store'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it('renders a buy more button when visiting the products page', () => {
  const mockStore = configureMockStore([])
  const store = mockStore()
  const header = mount(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/products']}>
        <Header />
      </MemoryRouter>
    </Provider>)

  expect(header.find('BuyMore').length).toBe(1)
})
