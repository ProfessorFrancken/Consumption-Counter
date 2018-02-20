import React from 'react';
import Committees from './index.js';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import { TYPES } from './../../actions';
import thunk from 'redux-thunk';

describe('committees', () => {
  it('renders', () => {
    const mockStore = configureMockStore([thunk]);

    const state = {
      members: [],
      committeeMembers: [
        {
          member_id: 1,
          year: 2017,
          function: 'King',
          committee: { id: 1, name: 'Board' }
        },
        {
          member_id: 2,
          year: 2017,
          function: '',
          committee: { id: 1, name: 'Board' }
        }
      ]
    };
    const store = mockStore({ ...state });
    const committees = shallow(<Committees store={store} />);

    expect(committees.props().committees.length).toBe(1);
    expect(committees.dive().find('Committee').length).toBe(1);
  });
});
