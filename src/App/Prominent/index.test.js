import React from 'react';
import Prominent from './index.js';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import { TYPES } from './../../actions';
import thunk from 'redux-thunk';

describe('prominent', () => {
  it('renders', () => {
    const mockStore = configureMockStore([thunk]);

    const state = {
      members: [
        { id: 1, firstName: 'John', surname: 'Snow' },
        { id: 2, firstName: 'John', surname: 'Snow' }
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
      members: [{ id: 1, firstName: 'John', surname: 'Snow' }],
      boardMembers: [
        { member_id: 1, year: 2017, function: 'King' },
        { member_id: 2, year: 2017, function: 'King' }
      ]
    };
    const store = mockStore({ ...state });
    const prominent = shallow(<Prominent store={store} />);

    expect(prominent.props().boards[0].length).toBe(1);
  });
});
