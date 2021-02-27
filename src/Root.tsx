import React from "react";
import {Provider} from "react-redux";
import {Router} from "react-router-dom";
import AppContainer from "./App/AppContainer";
import {history} from "./Setup/store";
import {AuthenticationProvider} from "App/Settings/Authentication/Context";
import {ReactQueryDevtools} from "react-query/devtools";
import {QueryClient, QueryClientProvider} from "react-query";
import {OrderProvider} from "App/Products/OrdersContext";
import {ProductsProvider} from "App/Products/ProductsContext";
import "./index.css";
import {CommitteesProvider} from "App/Committees/CommitteesContext";
import {BoardsProvider} from "App/Prominent/BoardsContext";
import {MembersProvider} from "App/Members/Context";
import {QueuedOrdersProvider} from "App/QueuedOrdersContext";
import {ActivitiesProvider} from "App/Activities/ActivitiesContext";
import {StatisticsProvider} from "App/Statistics/StatisticsContext";
import {TransactionsProvider} from "App/Transactions/TransactionsContext";
import {BusProvider} from "ts-bus/react";
import {EventBus} from "ts-bus/EventBus";
import {Store} from "redux";

type Props = {
  store: Store;
  queryClient?: QueryClient;
  bus?: EventBus;
};

export const InfrastructureProviders: React.FC<Props> = ({
  children,
  store,
  queryClient = new QueryClient(),
  bus = new EventBus(),
}) => {
  bus.subscribe("*", (event) => {
    store.dispatch({type: event.type, ...event.payload});
  });

  return (
    <Provider store={store}>
      <BusProvider value={bus}>
        <Router history={history}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </Router>
      </BusProvider>
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
      <QueuedOrdersProvider>
        <ProductsProvider>
          <MembersProvider>
            <CommitteesProvider>
              <BoardsProvider>
                <OrderProvider>
                  <ActivitiesProvider>
                    <StatisticsProvider>
                      <TransactionsProvider>{children}</TransactionsProvider>
                    </StatisticsProvider>
                  </ActivitiesProvider>
                </OrderProvider>
              </BoardsProvider>
            </CommitteesProvider>
          </MembersProvider>
        </ProductsProvider>
      </QueuedOrdersProvider>
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
