import React, {useMemo} from "react";
import {
  BrowserRouter,
  createBrowserRouter,
  createMemoryRouter,
  MemoryRouter,
  RouterProvider,
} from "react-router-dom";
import {createAppRoutes} from "./App/AppContainer";
import {ReactQueryDevtools} from "react-query/devtools";
import {QueryClient, QueryClientProvider} from "react-query";
import "./index.css";
import {BusProvider} from "ts-bus/react";
import {EventBus} from "ts-bus/EventBus";
import {ApplicationProviders} from "ApplicationProviders";

type Props = {
  queryClient?: QueryClient;
  bus?: EventBus;
  routes?: string[];
  children: React.ReactNode;
};

export const InfrastructureProviders: React.FC<Props> = ({
  children,
  routes,
  queryClient = new QueryClient(),
  bus = new EventBus(),
}) => {
  //const memoryRouter = createMemoryRouter();

  return (
    <BusProvider value={bus}>
      <QueryClientProvider client={queryClient}>
        {routes !== undefined ? (
          <MemoryRouter initialEntries={routes ?? []}>{children}</MemoryRouter>
        ) : (
          <BrowserRouter>{children}</BrowserRouter>
        )}
      </QueryClientProvider>
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

export const router = createBrowserRouter(createAppRoutes(ApplicationProviders));

const Root = () => {
  const [queryClient, bus] = useMemo(() => {
    const queryClient = new QueryClient();
    const bus = new EventBus();
    return [queryClient, bus] as const;
  });

  return (
    <BusProvider value={bus}>
      <QueryClientProvider client={queryClient}>
        <DevelopMentProviders>
          <RouterProvider router={router} />
        </DevelopMentProviders>
      </QueryClientProvider>
    </BusProvider>
  );
};

export default Root;
