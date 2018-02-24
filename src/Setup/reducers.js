import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {
  title,
  products,
  members,
  boardMembers,
  committeeMembers,
  surnameRanges,
  selectedMemberRange,
  transactions,
  order,
  queuedOrder
} from '../reducer.js';

export default combineReducers({
  title,
  members,
  boardMembers,
  committeeMembers,
  surnameRanges,
  selectedMemberRange,
  products,
  transactions,
  order,
  queuedOrder,
  router: routerReducer
});
