import React from "react";
import {Provider} from "react-redux";
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
    {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
    <Router history={history} basename={basename}>
      <AppContainer />
    </Router>
  </Provider>
);

export default Root;
