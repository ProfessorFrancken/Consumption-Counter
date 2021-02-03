import React from "react";
import {render, RenderOptions} from "@testing-library/react";
import {AuthenticationProvider} from "App/Settings/Authentication/Context";
import {mockedState} from "App/App.test";
import {create, history} from "./Setup/store";
import {InfrastructureProviders} from "Root";
import {ProductPurchaseProvider} from "App/Products/Context";

const defaultAuthentication = {
  request: false,
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MjI1OTE3MDIsImV4cCI6MTU1NDEyNzcwMiwicGx1cy1vbmUiOnRydWV9._KlpRSqK7AHgYX4WybMPJlTazuoU4OY1KoEyQtkiTd4",
};

const defaultOrder = {
  member: {
    id: 1,
    fullname: "John Snow",
    age: 19,
  },
  products: [],
};

const AllTheProviders: React.FC<{storeState: any; routes: string[]}> = ({
  children,
  storeState,
  routes,
  ...props
}) => {
  const {
    authentication = defaultAuthentication,
    ...stateWithoutAuthentication
  } = storeState;
  const {order = defaultOrder, ...state} = stateWithoutAuthentication;
  const store = create({...mockedState(), ...state});

  (routes || []).forEach((route) => history.push(route));

  return (
    <InfrastructureProviders store={store}>
      <AuthenticationProvider {...authentication}>
        <ProductPurchaseProvider order={order}>{children}</ProductPurchaseProvider>
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
