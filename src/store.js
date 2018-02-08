import { createStore, applyMiddleware, compose } from "redux";
import { routerMiddleware } from "react-router-redux";
import thunk from "redux-thunk";
import createHistory from "history/createBrowserHistory";
import rootReducer from "./reducers";
import { loadState, saveState } from './loadState'

export const history = createHistory();

const enhancers = [];

if (process.env.NODE_ENV === "development") {
    const devToolsExtension = window.devToolsExtension;

    if (typeof devToolsExtension === "function") {
        enhancers.push(devToolsExtension());
    }
}

const middleware = [thunk, routerMiddleware(history)];
const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

const persistedState = loadState();
const store = createStore(rootReducer, persistedState, composedEnhancers);
store.subscribe(() => {
    saveState(store.getState())
});

export default store;
