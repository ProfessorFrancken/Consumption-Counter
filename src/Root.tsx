import React from "react";
import {Router} from "react-router-dom";
import AppContainer from "./App/AppContainer";
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
import {createBrowserHistory} from "history";

const basename = process.env.REACT_APP_ROUTER_BASENAME || "";
export const history = createBrowserHistory({basename});

type Props = {
  queryClient?: QueryClient;
  bus?: EventBus;
  children: React.ReactNode;
};

export const InfrastructureProviders: React.FC<Props> = ({
  children,
  queryClient = new QueryClient(),
  bus = new EventBus(),
}) => {
  return (
    <BusProvider value={bus}>
      <Router history={history}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </Router>
    </BusProvider>
  );
};

const DevelopMentProviders: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </>
  );
};

export const ApplicationProviders: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
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

const Root = () => (
  <InfrastructureProviders>
    <DevelopMentProviders>
      <ApplicationProviders>
        <AppContainer />
      </ApplicationProviders>
    </DevelopMentProviders>
  </InfrastructureProviders>
);

export default Root;
