import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import rootReducer from './reducers';
import { loadState, saveState } from './loadState';
import api from './../api';
import buixieval from './../buixieval';

export const history = createBrowserHistory();

const enhancers = [];

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const middleware = [
  thunk.withExtraArgument(api),
  routerMiddleware(history),
  buixieval(window.fetch, new Date())
];

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

const persistedState = loadState();

export const create = () => {
  const store = createStore(
    rootReducer(history),
    persistedState,
    composedEnhancers
  );
  store.subscribe(() => {
    saveState(store.getState());
  });

  return store;
};

const store = create();

export default store;
