import React from "react";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import {Provider} from "react-redux";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import {Router} from "react-router-dom";
import AppContainer from "./App/AppContainer";
import {history} from "./Setup/store";

import "./index.css";

const basename = process.env.REACT_APP_ROUTER_BASENAME;

type Props = {
  store: any;
};

const Root = ({store}: Props) => (
  <Provider store={store}>
    <Router history={history} basename={basename}>
      <AppContainer />
    </Router>
  </Provider>
);

export default Root;
