import {combineReducers} from "redux";
import {connectRouter} from "connected-react-router";

import {loading, transactions, recentBuyers, statistics} from "../reducer";

const makeApplicationReducer = (history: any) => {
  return combineReducers({
    loading,
    transactions,
    recentBuyers,
    statistics,
    router: connectRouter(history),
  });
};

export default makeApplicationReducer;
