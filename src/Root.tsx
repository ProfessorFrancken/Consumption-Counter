import React from "react";
import {Provider} from "react-redux";
import {Router} from "react-router-dom";
import AppContainer from "./App/AppContainer";
import {history} from "./Setup/store";

import "./index.css";

type Props = {
  store: any;
};

const Providers: React.FC<Props> = ({children, store}) => {
  return (
    <Provider store={store}>
      <Router history={history}>{children}</Router>
    </Provider>
  );
};

const Root = ({store}: Props) => (
  <Providers store={store}>
    <AppContainer />
  </Providers>
);

export default Root;
