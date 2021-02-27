import {combineReducers} from "redux";
import {connectRouter} from "connected-react-router";

const makeApplicationReducer = (history: any) => {
  return combineReducers({
    router: connectRouter(history),
  });
};

export default makeApplicationReducer;
