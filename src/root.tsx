import {StrictMode, Suspense, useState} from "react";
import {
  BrowserRouter,
  createBrowserRouter,
  createMemoryRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import {createAppRoutes} from "./app-container";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import "./index.css";
import {ApplicationProviders} from "./application-providers";
import Loading from "./routes/loading/index";

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

  const router = createMemoryRouter(
    createRoutesFromElements(<Route path="/*" element={children} />),
    {initialEntries: routes ?? ["/"]}
  );

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      staleTime: Infinity,
      gcTime: Infinity,
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
        <Suspense fallback={<Loading />}>
          <RouterProvider
            router={router}
            future={{
              v7_startTransition: true,
            }}
          />
        </Suspense>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default Root;