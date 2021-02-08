import React from "react";
import {render, RenderOptions} from "@testing-library/react";
import {AuthenticationProvider} from "App/Settings/Authentication/Context";
import {
  defaultAuthentication,
  defaultCommitteeeMembers,
  defaultOrder,
  defaultProducts,
  mockedState,
} from "App/MockedState";
import {create, history} from "./Setup/store";
import {InfrastructureProviders} from "Root";
import {OrderProvider, Product} from "App/Products/OrdersContext";
import {ProductsProvider} from "App/Products/ProductsContext";
import {CommitteesProvider} from "App/Committees/CommitteesContext";

const AllTheProviders: React.FC<{storeState: any; routes: string[]}> = ({
  children,
  storeState,
  routes,
  ...props
}) => {
  const {
    authentication = defaultAuthentication,
    order = defaultOrder,
    products: productsByCategory = defaultProducts,
    committeeMembers = defaultCommitteeeMembers,
    ...state
  } = storeState;
  const store = create({...mockedState(), ...state});

  (routes || []).forEach((route) => history.push(route));

  const products = Object.values(productsByCategory).flatMap(
    (product) => product
  ) as Product[];

  return (
    <InfrastructureProviders store={store}>
      <AuthenticationProvider {...authentication}>
        <ProductsProvider products={products}>
          <CommitteesProvider committeeMembers={committeeMembers}>
            <OrderProvider order={order}>{children}</OrderProvider>
          </CommitteesProvider>
        </ProductsProvider>
      </AuthenticationProvider>
    </InfrastructureProviders>
  );
};

const customRender = (
  ui: React.ReactElement,
  options: Omit<RenderOptions, "queries"> & {
    wrapperProps?: any;
    storeState?: any;
    routes: string[];
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
