import {combineReducers} from "redux";
import {connectRouter} from "connected-react-router";

import {
  loading,
  members,
  boardMembers,
  surnameRanges,
  transactions,
  recentBuyers,
  queuedOrder,
  queuedOrders,
  menuItems,
  statistics,
  activities,
} from "../reducer";

const makeApplicationReducer = (history: any) => {
  return combineReducers({
    loading,
    members,
    boardMembers,
    surnameRanges,
    transactions,
    recentBuyers,
    queuedOrder,
    queuedOrders,
    menuItems,
    statistics,
    activities,
    router: connectRouter(history),
  });
};

export default makeApplicationReducer;
