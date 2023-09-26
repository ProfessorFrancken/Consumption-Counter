import React, {ReactNode} from "react";
import {render, RenderOptions} from "@testing-library/react";
import {AuthenticationProvider} from "App/Settings/Authentication/Context";
import {
  defaultAuthentication,
  defaultCommitteeeMembers,
  defaultMembers,
  defaultOrder,
  defaultProducts,
} from "App/MockedState";
import {InfrastructureProviders} from "Root";
import {OrderProvider, Product} from "App/Products/OrdersContext";
import {ProductsProvider} from "App/Products/ProductsContext";
import {CommitteesProvider} from "App/Committees/CommitteesContext";
import {BoardsProvider} from "App/Prominent/BoardsContext";
import {defaultBoardMembers} from "App/MockedState";
import {MembersProvider} from "App/Members/Context";
import {QueuedOrdersProvider} from "App/QueuedOrdersContext";
import {ActivitiesProvider} from "App/Activities/ActivitiesContext";
import {StatisticsProvider} from "App/Statistics/StatisticsContext";
import {QueryClient, setLogger} from "react-query";
import {TransactionsProvider} from "App/Transactions/TransactionsContext";
import {MemoryRouter} from "react-router-dom";

const AllTheProviders: React.FC<{
  storeState: any;
  routes: string[];
  children: React.ReactNode;
}> = ({children, storeState = {}, routes, ...props}) => {
  const {
    authentication = defaultAuthentication,
    order = defaultOrder,
    products: productsByCategory = defaultProducts,
    committeeMembers = defaultCommitteeeMembers,
    boardMembers = defaultBoardMembers,
    members = defaultMembers,
    queuedOrder = null,
    queuedOrders = [],
    activities = [],
    statistics = [],
  } = storeState;
  // (routes || []).forEach((route) => history.push(route));

  const products = Object.values(productsByCategory).flatMap(
    (product) => product
  ) as Product[];

  const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: false}},
  });
  setLogger({
    warn: () => {},
    error: () => {},
    log: () => {},
  });

  // TODO put the test application providers in a separat thing that we pass to infrastructure providers?
  return (
    <InfrastructureProviders queryClient={queryClient} routes={routes}>
      <AuthenticationProvider {...authentication}>
        <QueuedOrdersProvider
          queuedOrder={queuedOrder ?? undefined}
          queuedOrders={queuedOrders ?? undefined}
        >
          <ProductsProvider products={products ?? undefined}>
            <MembersProvider members={members ?? undefined}>
              <CommitteesProvider committeeMembers={committeeMembers ?? undefined}>
                <BoardsProvider boardMembers={boardMembers ?? undefined}>
                  <OrderProvider order={order ?? undefined}>
                    <ActivitiesProvider activities={activities ?? undefined}>
                      <StatisticsProvider statistics={statistics ?? undefined}>
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
    </InfrastructureProviders>
  );
};

const customRender = (
  ui: React.ReactElement,
  options: Omit<RenderOptions, "queries"> & {
    wrapperProps?: any;
    storeState?: any;
    routes?: string[];
  } = {
    wrapperProps: {},
    storeState: {},
    routes: ["/"],
  }
) => {
  const wrapper = (props: any) => (
    <AllTheProviders
      {...props}
      storeState={options.storeState}
      routes={options.routes}
      {...options.wrapperProps}
    />
  );

  return render(ui, {wrapper, ...options});
};

// re-export everything
export * from "@testing-library/react";

// override render method
export {customRender as render};

export const flushAllPromises = () => new Promise((resolve) => setImmediate(resolve));

// TODO also add mirage / msw mock server here
