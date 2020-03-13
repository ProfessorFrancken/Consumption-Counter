import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Footer from './Footer';
import configureMockStore from 'redux-mock-store';

it('renders without crashing', () => {
  const mockStore = configureMockStore();
  const store = mockStore({ queuedOrder: null, order: { products: [] } });

  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
