import {createStore, applyMiddleware, compose} from "redux";
import {routerMiddleware} from "connected-react-router";
import thunk from "redux-thunk";
import {createBrowserHistory} from "history";
import rootReducer from "./reducers";
import {loadState, saveState} from "./loadState";
import api from "./../api";

const basename = process.env.REACT_APP_ROUTER_BASENAME || "";
export const history = createBrowserHistory({basename});

const enhancers = [];
if (process.env.NODE_ENV === "development") {
  const devToolsExtension = (window as any).devToolsExtension;
  if (typeof devToolsExtension === "function") {
    enhancers.push(devToolsExtension());
  }
}

const middleware = [thunk.withExtraArgument(api), routerMiddleware(history)];

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

const persistedState = loadState();

// Note that the only use case for passing an existing state is for testing purposes
export const create = (state?: any) => {
  const store = createStore(
    rootReducer(history),
    state === undefined ? persistedState : state,
    composedEnhancers
  );

  store.subscribe(() => {
    saveState(store.getState());
  });

  return store;
};

const store = create();

export default store;
