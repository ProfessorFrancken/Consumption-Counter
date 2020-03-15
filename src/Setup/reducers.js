import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import {
  authentication,
  loading,
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

export default history =>
  combineReducers({
    authentication,
    loading,
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
    router: connectRouter(history)
  });
