import React from 'react';
import GoBack from './GoBack';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import { TYPES } from './../actions';
import { goBack } from 'react-router-redux';
import thunk from 'redux-thunk';

describe('<GoBack />', () => {
  it('renders', () => {
    const mockStore = configureMockStore([thunk]);

    const store = mockStore();
    const goback = shallow(<GoBack store={store} />);

    goback
      .dive()
      .find('button')
      .simulate('click');

    expect(store.getActions()).toEqual([goBack(), { type: TYPES.GO_BACK }]);
  });
});
