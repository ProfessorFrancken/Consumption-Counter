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
      members: [],
      committeeMembers: [],
      boardMembers: []
    };
    const store = mockStore({ ...state });
    const prominent = shallow(<Prominent store={store} />);

    /* console.log(prominent.dive().html());*/

    /* goback
     *   .dive()
     *   .find('button')
     *   .simulate('click');

     * expect(store.getActions()).toEqual([push('/'), { type: TYPES.GO_BACK }]);*/
  });
});
