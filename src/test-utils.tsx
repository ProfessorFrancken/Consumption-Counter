import React from "react";
import {render, RenderOptions} from "@testing-library/react";

const AllTheProviders: React.FC = ({children}) => {
  return <>{children}</>;
};

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, "queries">) =>
  render(ui, {wrapper: AllTheProviders, ...options});

// re-export everything
export * from "@testing-library/react";

// override render method
export {customRender as render};

export const flushAllPromises = () => new Promise((resolve) => setImmediate(resolve));

// TODO also add mirage / msw mock server here
