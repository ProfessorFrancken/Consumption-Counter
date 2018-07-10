import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import Authentication from './index';
import api from './../../../api';
import { TYPES } from './../../../actions';
import moxios from 'moxios';

describe('Authentication', () => {
  let store, app;
  const base_api = process.env.REACT_APP_API_SERVER;
  const flushAllPromises = () => new Promise(resolve => setImmediate(resolve));

  const middlewares = [thunk.withExtraArgument(api)];
  const mockStore = configureMockStore(middlewares);

  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it('Shows a warning that the system is not authenticated', () => {
    const store = mockStore({
      authentication: { token: null, request: false }
    });

    app = mount(
      <Provider store={store}>
        <Authentication />
      </Provider>
    );

    expect(app.find('Icon').length).toBe(1);
    expect(app.find('input[type="submit"]').props().value).toBe('Authenticate');
  });

  it('authenticates the plus one system', done => {
    const store = mockStore({
      authentication: { token: null, request: false }
    });
    const token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MjI1OTE3MDIsImV4cCI6MTU1NDEyNzcwMiwicGx1cy1vbmUiOnRydWV9._KlpRSqK7AHgYX4WybMPJlTazuoU4OY1KoEyQtkiTd4';

    moxios.stubRequest(`${base_api}/authenticate`, {
      response: { token },
      headers: { 'content-type': 'application/json' }
    });

    app = mount(
      <Provider store={store}>
        <Authentication />
      </Provider>
    );

    app
      .find('input[type="password"]')
      .simulate('change', { target: { value: 'hoi' } });

    app.find('form').simulate('submit');

    flushAllPromises()
      .then(() => {
        expect(store.getActions()).toEqual([
          { type: TYPES.AUTHENTICATE_REQUEST, password: 'hoi' },
          { type: TYPES.AUTHENTICATE_SUCCESS, token }
        ]);
        done();
      })
      .catch(e => done.fail(e));
  });
});
