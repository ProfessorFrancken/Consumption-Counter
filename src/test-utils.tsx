import React from "react";
import {render, RenderOptions} from "@testing-library/react";
import {Provider} from "react-redux";
import {MemoryRouter} from "react-router";
import {AuthenticationProvider} from "App/Settings/Authentication/Context";
import {mockedState} from "App/App.test";
import {create, history} from "./Setup/store";

const AllTheProviders: React.FC<{storeState: any; routes: string[]}> = ({
  children,
  storeState,
  routes,
  ...props
}) => {
  const store = create({...mockedState(), ...storeState});

  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={routes}>
        <AuthenticationProvider>{children}</AuthenticationProvider>
      </MemoryRouter>
    </Provider>
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
