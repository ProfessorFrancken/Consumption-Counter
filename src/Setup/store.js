import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import rootReducer from './reducers';
import { loadState, saveState } from './loadState';
import api from './../api';

export const history = createHistory();

const enhancers = [];

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const middleware = [thunk.withExtraArgument(api), routerMiddleware(history)];

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

const persistedState = loadState();

export const create = () => {
  const store = createStore(rootReducer, persistedState, composedEnhancers);
  store.subscribe(() => {
    saveState(store.getState());
  });

  return store;
};

const store = create();

export default store;
