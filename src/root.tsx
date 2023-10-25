import {StrictMode, Suspense, useState} from "react";
import {
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
import {BuyProductsForMemberTitle, CommitteeTitle} from "components/layout/header";

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
    createRoutesFromElements(
      <Route path="/*" element={children}>
        <Route index />
        <Route
          path="settings"
          handle={{
            title: <span>Settings</span>,
          }}
        />
        <Route path="compucie" />
        <Route
          path="prominent"
          handle={{
            title: <span>Prominent</span>,
          }}
        />
        <Route
          path="statistics"
          handle={{
            title: <span>Statistics</span>,
          }}
        />
        <Route
          path="committees"
          handle={{
            title: <span>Committees</span>,
          }}
        />
        <Route
          path="committees/:page"
          handle={{
            title: <CommitteeTitle />,
          }}
        />
        <Route
          path="recent"
          handle={{
            title: <span>Recent</span>,
          }}
        />
        <Route
          path="products"
          handle={{
            title: <BuyProductsForMemberTitle />,
          }}
        />
        <Route
          path="products/pricelist"
          handle={{
            title: <span>Pricelist</span>,
          }}
        />
        <Route
          path="statistics"
          handle={{
            title: <span>Statistics</span>,
          }}
        />
        <Route
          path="present"
          handle={{
            title: <span>Present</span>,
          }}
        />
        <Route path="members/:page" />
        <Route path="members" />
      </Route>
    ),
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
