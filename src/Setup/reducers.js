import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {
  authenticationToken,
  title,
  products,
  members,
  boardMembers,
  committeeMembers,
  surnameRanges,
  transactions,
  recentBuyers,
  order,
  queuedOrder
} from '../reducer.js';

export default combineReducers({
  authenticationToken,
  title,
  members,
  boardMembers,
  committeeMembers,
  surnameRanges,
  products,
  transactions,
  recentBuyers,
  order,
  queuedOrder,
  router: routerReducer
});
