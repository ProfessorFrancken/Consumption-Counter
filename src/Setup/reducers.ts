import {combineReducers} from "redux";
import {connectRouter} from "connected-react-router";

import {transactions, recentBuyers, statistics} from "../reducer";

const makeApplicationReducer = (history: any) => {
  return combineReducers({
    transactions,
    recentBuyers,
    statistics,
    router: connectRouter(history),
  });
};

export default makeApplicationReducer;
