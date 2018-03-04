import React from 'react';
import Committees from './index.js';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import { TYPES } from './../../actions';
import thunk from 'redux-thunk';
import clock from 'jest-plugin-clock';

describe('committees', () => {
  clock.set('2018-01-01');

  it('renders', () => {
    const mockStore = configureMockStore([thunk]);

    const state = {
      members: [{ id: 1 }, { id: 2 }],
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

    let committee = committees.props().committees[0];
    expect(committee.members.length).toBe(2);
  });

  it("ignores committee members that aren't in the system", () => {
    const mockStore = configureMockStore([thunk]);
    const state = {
      members: [{ id: 1 }],
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

    let committee = committees.props().committees[0];
    expect(committee.members.length).toBe(1);
  });
});
