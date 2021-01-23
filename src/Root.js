import React from "react";
import PropTypes from "prop-types";
import {Provider} from "react-redux";
import {Router} from "react-router-dom";
import AppContainer from "./App/AppContainer";
import {history} from "./Setup/store";

import "./index.css";

const basename = process.env.REACT_APP_ROUTER_BASENAME;

const Root = ({store}) => (
  <Provider store={store}>
    <Router history={history} basename={basename}>
      <AppContainer />
    </Router>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
