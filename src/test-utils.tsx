import React from "react";
import {render, RenderOptions} from "@testing-library/react";
import {AuthenticationProvider} from "App/Settings/Authentication/Context";
import {
  defaultAuthentication,
  defaultCommitteeeMembers,
  defaultMembers,
  defaultProducts,
} from "App/MockedState";
import {InfrastructureProviders} from "Root";
import {Product, Order, OrderProvider} from "App/Products/OrdersContext";
import {ProductsProvider} from "App/Products/ProductsContext";
import {CommitteesProvider} from "App/Committees/CommitteesContext";
import {BoardsProvider} from "App/Prominent/BoardsContext";
import {defaultBoardMembers} from "App/MockedState";
import {MembersProvider} from "App/Members/Context";
import {QueuedOrdersProvider} from "App/QueuedOrdersContext";
import {ActivitiesProvider} from "App/Activities/ActivitiesContext";
import {StatisticsProvider} from "App/Statistics/StatisticsContext";
import {QueryClient} from "@tanstack/react-query";
import {TransactionsProvider} from "App/Transactions/TransactionsContext";
import {MemberType} from "App/Members/Members";

type StoreState = {
  authentication?: any;
  order?: Order;
  products?: any;
  committeeMembers?: any;
  boardMembers?: any;
  members?: any;
  queuedOrder?: any;
  queuedOrders?: any;
  activities?: any;
  statistics?: any;
};

const AllTheProviders: React.FC<{
  storeState: StoreState;
  routes: string[];
  children: React.ReactNode;
}> = ({children, storeState = {}, routes, ...props}) => {
  const {
    authentication = defaultAuthentication,
    order = {
      memberId: undefined,
      member: undefined,
      products: [],
    },
    products: productsByCategory = defaultProducts,
    committeeMembers = defaultCommitteeeMembers,
    boardMembers = defaultBoardMembers,
    members = defaultMembers,
    queuedOrder = null,
    queuedOrders = [],
    activities = [],
    statistics = [],
  } = storeState;

  const products = Object.values(productsByCategory).flatMap(
    (product) => product
  ) as Product[];

  const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: false}},
    logger: {
      warn: () => {},
      error: () => {},
      log: () => {},
    },
  });

  const actualRoutes = routes !== undefined ? routes : ["/"];

  // TODO put the test application providers in a separat thing that we pass to infrastructure providers
  return (
    <InfrastructureProviders queryClient={queryClient} routes={actualRoutes}>
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
    storeState?: StoreState;
    routes?: string[];
  } = {
    wrapperProps: {},
    storeState: {},
    routes: undefined,
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

export const getMember = (member: Partial<MemberType> = {}): MemberType => {
  return {
    fullname: "John snow",
    id: 1,
    firstName: "John",
    surname: "Snow",
    latest_purchase_at: null,
    age: 18,
    prominent: null,
    cosmetics: undefined,
    ...member,
  };
};

export const getProduct = (product: Partial<Product> = {}): Product => {
  return {
    id: 27,
    name: "Ice Tea",
    price: 60,
    position: 999,
    category: "Fris",
    image: "",
    splash_image: "",
    age_restriction: null,
    ...product,
  };
};
