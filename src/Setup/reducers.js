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
  order,
  queuedOrder,
  router: routerReducer
});
