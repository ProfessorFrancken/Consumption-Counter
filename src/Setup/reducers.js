import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {
  authentication,
  title,
  products,
  members,
  boardMembers,
  committeeMembers,
  surnameRanges,
  transactions,
  recentBuyers,
  order,
  queuedOrder,
  queuedOrders,
  menuItems,
  statistics,
  activities
} from '../reducer.js';

export default combineReducers({
  authentication,
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
  queuedOrders,
  menuItems,
  statistics,
  activities,
  router: routerReducer
});
