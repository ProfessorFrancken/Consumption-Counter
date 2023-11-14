import React, {Suspense} from "react";
import {render, RenderOptions} from "@testing-library/react";
import {AuthenticationProvider} from "./components/authentication/context";
import {
  defaultAuthentication,
  defaultBoardMembers,
  defaultCommitteeeMembers,
  defaultMembers,
  defaultProducts,
} from "./test-utils/mocked-state";
import {InfrastructureProviders} from "./root";
import {Product, Order, OrderProvider} from "./components/orders-context";
import {QueuedOrdersProvider} from "./components/orders/queued-orders-context";
import {QueryClient} from "@tanstack/react-query";
import {MemberType} from "./queries/members";

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
  dontRenderRouterProvider?: boolean;
}> = ({
  children,
  storeState = {},
  routes,
  dontRenderRouterProvider = false,
  ...props
}) => {
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
  });

  if (members) {
    queryClient.setQueryData(["members"], members);
  }

  if (products) {
    queryClient.setQueryData(["products"], products);
  }

  if (boardMembers) {
    queryClient.setQueryData(["boards"], boardMembers);
  }

  if (committeeMembers) {
    queryClient.setQueryData(["committees"], committeeMembers);
  }

  if (activities) {
    queryClient.setQueryData(["activities"], activities);
  }

  if (statistics) {
    queryClient.setQueryData(["statistics", "categories"], statistics);
  }

  const actualRoutes = routes !== undefined ? routes : ["/"];

  // TODO put the test application providers in a separat thing that we pass to infrastructure providers
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InfrastructureProviders
        queryClient={queryClient}
        routes={actualRoutes}
        dontRenderRouterProvider={dontRenderRouterProvider}
      >
        {dontRenderRouterProvider ? (
          <>{children}</>
        ) : (
          <AuthenticationProvider {...authentication}>
            <QueuedOrdersProvider
              queuedOrder={queuedOrder ?? undefined}
              queuedOrders={queuedOrders ?? undefined}
            >
              <OrderProvider order={order ?? undefined}>{children}</OrderProvider>
            </QueuedOrdersProvider>
          </AuthenticationProvider>
        )}
      </InfrastructureProviders>
    </Suspense>
  );
};

const customRender = (
  ui: React.ReactElement,
  options: Omit<RenderOptions, "queries"> & {
    wrapperProps?: any;
    storeState?: StoreState;
    routes?: string[];
    dontRenderRouterProvider?: boolean;
  } = {
    wrapperProps: {},
    storeState: {},
    routes: undefined,
    dontRenderRouterProvider: false,
  }
) => {
  const wrapper = (props: any) => (
    <AllTheProviders
      dontRenderRouterProvider={options.dontRenderRouterProvider}
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
