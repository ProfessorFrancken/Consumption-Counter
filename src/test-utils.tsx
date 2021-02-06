import React from "react";
import {render, RenderOptions} from "@testing-library/react";
import {AuthenticationProvider} from "App/Settings/Authentication/Context";
import {mockedState} from "App/App.test";
import {create, history} from "./Setup/store";
import {InfrastructureProviders} from "Root";
import {OrderProvider, Product} from "App/Products/OrdersContext";
import {ProductsProvider} from "App/Products/ProductsContext";

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

const defaultProducts = {
  Bier: [
    {
      id: 3,
      name: "Hertog Jan",
      price: 68,
      position: 1,
      category: "Bier",
      image: "wCwnyLXTVdPEnKRXjw9I.png",
      splash_image: "Uo6qQC4Hm8TUqyNjw2G4.jpg",
      age_restriction: 18,
    },
  ],
  Fris: [
    {
      id: 27,
      name: "Ice Tea",
      price: 60,
      position: 999,
      category: "Fris",
      image: "",
      age_restriction: null,
    },
  ],
  Eten: [
    {
      id: 243,
      name: "Kinder Bueno",
      price: 55,
      position: 999,
      category: "Eten",
      image: "utnCWM87tZclyENVrG03.jpg",
      age_restriction: null,
    },
  ],
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
  const {order = defaultOrder, ...stateWithoutOrder} = stateWithoutAuthentication;
  const {products: productsByCategory = defaultProducts, ...state} = stateWithoutOrder;
  const store = create({...mockedState(), ...state});

  (routes || []).forEach((route) => history.push(route));

  const products = Object.values(productsByCategory).flatMap(
    (product) => product
  ) as Product[];

  return (
    <InfrastructureProviders store={store}>
      <AuthenticationProvider {...authentication}>
        <ProductsProvider products={products}>
          <OrderProvider order={order}>{children}</OrderProvider>
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
