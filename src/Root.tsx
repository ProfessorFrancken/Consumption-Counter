import {StrictMode, Suspense, useState} from "react";
import {
  BrowserRouter,
  createBrowserRouter,
  MemoryRouter,
  RouterProvider,
} from "react-router-dom";
import {createAppRoutes} from "./App/AppContainer";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import "./index.css";
import {ApplicationProviders} from "ApplicationProviders";
import LoadingScreen from "Loading";

type Props = {
  queryClient?: QueryClient;
  routes?: string[];
  children: React.ReactNode;
};

export const InfrastructureProviders = ({
  children,
  routes,
  queryClient: defaultQueryClient = new QueryClient(),
}: Props) => {
  const [queryClient] = useState(defaultQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {routes !== undefined ? (
        <MemoryRouter initialEntries={routes ?? []}>{children}</MemoryRouter>
      ) : (
        <BrowserRouter>{children}</BrowserRouter>
      )}
    </QueryClientProvider>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      staleTime: Infinity,
    },
  },
});

export const router = createBrowserRouter(
  createAppRoutes(queryClient, ApplicationProviders)
);

const Root = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingScreen />}>
          <RouterProvider router={router} />
        </Suspense>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default Root;
