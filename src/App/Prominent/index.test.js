import React from 'react';
import Prominent from './index.js';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import { TYPES } from './../../actions';
import thunk from 'redux-thunk';
import clock from 'jest-plugin-clock';

describe('prominent', () => {
  clock.set('2018-01-01');

  it('renders', () => {
    const mockStore = configureMockStore([thunk]);

    const state = {
      members: [
        {
          id: 1,
          firstName: 'John',
          surname: 'Snow',
          latest_purchase_at: new Date('2017-12-01')
        },
        {
          id: 2,
          firstName: 'John',
          surname: 'Snow',
          latest_purchase_at: new Date('2017-12-01')
        }
      ],
      boardMembers: [
        { member_id: 1, year: 2017, function: 'King' },
        { member_id: 2, year: 2017, function: 'King' }
      ]
    };
    const store = mockStore({ ...state });
    const prominent = shallow(<Prominent store={store} />);

    expect(prominent.props().boards[0].length).toBe(2);
  });

  it("it ignores members that aren't in the system", () => {
    const mockStore = configureMockStore([thunk]);

    const state = {
      members: [
        {
          id: 1,
          firstName: 'John',
          surname: 'Snow',
          latest_purchase_at: new Date('2017-12-01')
        }
      ],
      boardMembers: [
        { member_id: 1, year: 2017, function: 'King' },
        { member_id: 2, year: 2017, function: 'King' }
      ]
    };
    const store = mockStore({ ...state });
    const prominent = shallow(<Prominent store={store} />);

    expect(prominent.props().boards[0].length).toBe(1);
  });

  it('Only shows prominent members if they bought a product recently', () => {
    const mockStore = configureMockStore([thunk]);

    const state = {
      members: [
        {
          id: 1,
          firstName: 'John',
          surname: 'Snow',
          latest_purchase_at: new Date('2017-12-01'),
          prominent: 999
        },
        {
          id: 2,
          firstName: 'Arya',
          surname: 'Snow',
          latest_purchase_at: new Date('2016-12-01'),
          prominent: 999
        }
      ],
      boardMembers: [
        { member_id: 2, year: 2017, function: 'King' },
        { member_id: 2, year: 2016, function: 'King' },
        { member_id: 2, year: 2015, function: 'King' },
        { member_id: 2, year: 2014, function: 'King' },
        { member_id: 2, year: 2013, function: 'King' },
        { member_id: 1, year: 2012, function: 'King' }
      ]
    };
    const store = mockStore({ ...state });
    const prominent = shallow(<Prominent store={store} />);

    expect(prominent.props().prominent.length).toBe(1);
  });
});
