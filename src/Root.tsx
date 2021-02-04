import React from "react";
import {Provider} from "react-redux";
import {Router} from "react-router-dom";
import AppContainer from "./App/AppContainer";
import {history} from "./Setup/store";
import {AuthenticationProvider} from "App/Settings/Authentication/Context";
import {ReactQueryDevtools} from "react-query/devtools";
import {QueryClient, QueryClientProvider} from "react-query";
import {OrderProvider} from "App/Products/OrdersContext";
import "./index.css";

type Props = {
  store: any;
};

export const InfrastructureProviders: React.FC<Props> = ({children, store}) => {
  const queryClient = new QueryClient();
  return (
    <Provider store={store}>
      <Router history={history}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </Router>
    </Provider>
  );
};

const DevelopMentProviders: React.FC = ({children}) => {
  return (
    <>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </>
  );
};

export const ApplicationProviders: React.FC = ({children}) => {
  return (
    <AuthenticationProvider>
      <OrderProvider>{children}</OrderProvider>
    </AuthenticationProvider>
  );
};

const Root = ({store}: Props) => (
  <InfrastructureProviders store={store}>
    <DevelopMentProviders>
      <ApplicationProviders>
        <AppContainer />
      </ApplicationProviders>
    </DevelopMentProviders>
  </InfrastructureProviders>
);

export default Root;
