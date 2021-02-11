import {combineReducers} from "redux";
import {connectRouter} from "connected-react-router";

import {
  loading,
  transactions,
  recentBuyers,
  menuItems,
  statistics,
  activities,
} from "../reducer";

const makeApplicationReducer = (history: any) => {
  return combineReducers({
    loading,
    transactions,
    recentBuyers,
    menuItems,
    statistics,
    activities,
    router: connectRouter(history),
  });
};

export default makeApplicationReducer;
