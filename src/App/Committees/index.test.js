import React from 'react';
import { default as CommitteesContainer } from './index.js';
import Committees from './Committees.js';
import configureMockStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { TYPES } from './../../actions';
import { Provider } from 'react-redux';
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
    const committees = mount(
      <Provider store={store}>
        <CommitteesContainer store={store} />
      </Provider>
    );

    expect(committees.find(Committees).props().committees.length).toBe(1);
    expect(committees.find(Committees).find('Committee').length).toBe(1);

    let committee = committees.find(Committees).props().committees[0];
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
    const committees = mount(
      <Provider store={store}>
        <CommitteesContainer store={store} />
      </Provider>
    );

    let committee = committees.find(Committees).props().committees[0];
    expect(committee.members.length).toBe(1);
  });

  it('ignores duplicated committee members', () => {
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
          member_id: 1,
          year: 2016,
          function: 'King',
          committee: { id: 1, name: 'Board' }
        }
      ]
    };
    const store = mockStore({ ...state });
    const committees = mount(
      <Provider store={store}>
        <CommitteesContainer store={store} />
      </Provider>
    );

    let committee = committees.find(Committees).props().committees[0];
    expect(committee.members.length).toBe(1);
  });
});
