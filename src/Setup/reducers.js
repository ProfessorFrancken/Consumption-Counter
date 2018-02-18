import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {
  title,
  products,
  members,
  surnameRanges,
  selectedMemberRange,
  transactions,
  order
} from '../reducer.js';

export default combineReducers({
  title,
  members,
  surnameRanges,
  selectedMemberRange,
  products,
  transactions,
  order,
  router: routerReducer
});
