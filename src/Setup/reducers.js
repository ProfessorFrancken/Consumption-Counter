import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {
  title,
  products,
  members,
  surnameRanges,
  selectedMemberRange,
  buyMore,
  transactions,
  order
} from '../reducer.js';

export default combineReducers({
  title,
  members,
  surnameRanges,
  selectedMemberRange,
  products,
  buyMore,
  transactions,
  order,
  router: routerReducer
});
