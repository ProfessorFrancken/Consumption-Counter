import {ReactNode, StrictMode, useMemo, useState} from "react";
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

const DevelopMentProviders = ({children}: {children: ReactNode}) => {
  return <>{children}</>;
};

export const router = createBrowserRouter(createAppRoutes(ApplicationProviders));

const Root = () => {
  const queryClient = useMemo(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false, // default: true
        },
      },
    });
  }, []);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <DevelopMentProviders>
          <RouterProvider router={router} />
        </DevelopMentProviders>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default Root;
