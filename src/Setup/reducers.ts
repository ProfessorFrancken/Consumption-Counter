import {combineReducers} from "redux";
import {connectRouter} from "connected-react-router";
import {transactions, recentBuyers} from "../reducer";

const makeApplicationReducer = (history: any) => {
  return combineReducers({
    transactions,
    recentBuyers,
    router: connectRouter(history),
  });
};

export default makeApplicationReducer;
