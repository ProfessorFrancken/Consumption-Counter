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
        <Route
          path="settings"
          element={<></>}
          handle={{
            title: <span>Settings</span>,
          }}
        />
        <Route path="compucie" element={<></>} />
        <Route
          path="prominent"
          element={<></>}
          handle={{
            title: <span>Prominent</span>,
          }}
        />
        <Route
          path="statistics"
          element={<></>}
          handle={{
            title: <span>Statistics</span>,
          }}
        />
        <Route
          path="committees"
          element={<></>}
          handle={{
            title: <span>Committees</span>,
          }}
        />
        <Route
          path="committees/:page"
          element={<></>}
          handle={{
            title: <CommitteeTitle />,
          }}
        />
        <Route
          path="recent"
          element={<></>}
          handle={{
            title: <span>Recent</span>,
          }}
        />
        <Route
          path="products"
          element={<></>}
          handle={{
            title: <BuyProductsForMemberTitle />,
          }}
        />
        <Route
          path="products/pricelist"
          element={<></>}
          handle={{
            title: <span>Pricelist</span>,
          }}
        />
        <Route
          path="statistics"
          element={<></>}
          handle={{
            title: <span>Statistics</span>,
          }}
        />
        <Route
          path="present"
          element={<></>}
          handle={{
            title: <span>Present</span>,
          }}
        />
        <Route path="members/:page" element={<></>} />
        <Route path="members" element={<></>} />
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
