import React from 'react';
import GoBack from './GoBack';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import { TYPES } from './../actions';
import { push } from 'react-router-redux';
import thunk from 'redux-thunk';

it('renders', () => {
  const mockStore = configureMockStore([thunk]);

  const store = mockStore();
  const goback = shallow(<GoBack store={store} />);

  goback
    .dive()
    .find('button')
    .simulate('click');

  /* expect(goback.props().onClick).toBe(0)*/
  expect(store.getActions()).toEqual([push('/'), { type: TYPES.GO_BACK }]);
});
