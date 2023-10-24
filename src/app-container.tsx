import {
  Navigate,
  Routes,
  Route,
  Outlet,
  createRoutesFromElements,
  useRouteError,
  isRouteErrorResponse,
  ErrorResponse,
  defer,
  Await,
  useLoaderData,
} from "react-router-dom";
import RedirectWhenIdle from "./components/redirect-when-idle";
import SurnameRanges from "./routes/index";
import SelectMemberFromSurnameRange from "./routes/members/index";
import Products from "./routes/products/index";
import PriceList from "./routes/products/pricelist/index";
import Prominent from "./routes/prominent/index";
import Committees from "./routes/committees/index";
import SelectMemberFromCommittee from "./routes/committees/members/index";
import RecentMembers from "./routes/recent/index";
import Compucie from "./routes/compucie/index";
import Settings from "./routes/compucie/settings/index";
import Statistics from "./routes/statistics/index";
import Present from "./routes/present/index";
import {Layout} from "./components/layout/layout";
import {ApplicationProviders} from "./application-providers";
import "./components/font-awesome";
import {UnauthenticatedLayout} from "./components/layout/unauthenticated-layout";
import AuthenticationForm from "./components/authentication/authentication-form";
import Loading from "./routes/loading/index";
import {Suspense} from "react";
import {QueryClient} from "@tanstack/react-query";
import {productsQueryOptions} from "./queries/products";
import {committeeMembersQueryOptions} from "./queries/committees";
import {boardMembersQueryOptions} from "./queries/boards";
import {statisticsQueryOptions} from "./queries/statistics";
import {ordersQueryOptions} from "./queries/orders";
import moment from "moment";
import {activitiesQueryOptions} from "./queries/activities";
import {membersQueryOptions} from "./queries/members";
import {BuyProductsForMemberTitle, CommitteeTitle} from "components/layout/header";

function isErrorResponse(error: any): error is ErrorResponse {
  return (
    error != null &&
    typeof error.status === "number" &&
    typeof error.statusText === "string"
  );
}

const ErrorBoundary = () => {
  const error = useRouteError();

  console.log({error});

  if (isRouteErrorResponse(error) || isErrorResponse(error)) {
    if ([401, 403].includes(error.status)) {
      return (
        <UnauthenticatedLayout>
          <h1>Unauthorized</h1>
          <AuthenticationForm />
        </UnauthenticatedLayout>
      );
    }
  }

  return (
    <UnauthenticatedLayout>
      <h1>Something's wrong!</h1>
      <p className="lead">Oh no something is wrong. Try refreshing the page.</p>
      <p className="text-muted">
        If this persists then try and have a look at the network tab to see if there's an
        internet connection and/or if the server is down.
      </p>
      <a href="/" className="btn btn-danger">
        Refresh
      </a>
    </UnauthenticatedLayout>
  );
};

const ErrorBoundaryLayout = () => {
  const data = useLoaderData() as {queries: unknown};

  console.log("error boundary layout", data);
  return (
    <Suspense fallback={<Loading />}>
      <RedirectWhenIdle />
      <Outlet />
    </Suspense>
  );
};

const sleep = (n: number) => new Promise((resolve) => setTimeout(resolve, n));

export const createAppRoutes = (
  queryClient: QueryClient,
  ApplicationProvidersComponent: typeof ApplicationProviders
) => {
  return createRoutesFromElements(
    <Route
      path="/"
      element={
        <ApplicationProvidersComponent>
          <ErrorBoundaryLayout />
        </ApplicationProvidersComponent>
      }
      errorElement={<ErrorBoundary />}
    >
      <Route path="loading" element={<Loading />} />

      <Route
        element={
          <Layout>
            <Outlet />
          </Layout>
        }
      >
        <Route index element={<SurnameRanges />} />
        <Route
          path="settings"
          element={<Settings />}
          handle={{
            title: <span>Settings</span>,
          }}
        />
        <Route path="compucie" element={<Compucie />} />
        <Route
          path="prominent"
          element={<Prominent />}
          handle={{
            title: <span>Prominent</span>,
          }}
        />
        <Route
          path="statistics"
          element={<Statistics />}
          handle={{
            title: <span>Statistics</span>,
          }}
        />
        <Route
          path="committees"
          element={<Committees />}
          handle={{
            title: <span>Committees</span>,
          }}
        />
        <Route
          path="committees/:page"
          element={<SelectMemberFromCommittee />}
          handle={{
            title: <CommitteeTitle />,
          }}
        />
        <Route
          path="recent"
          element={<RecentMembers />}
          handle={{
            title: <span>Recent</span>,
          }}
        />
        <Route
          path="products"
          element={<Products />}
          handle={{
            title: <BuyProductsForMemberTitle />,
          }}
        />
        <Route
          path="products/pricelist"
          element={<PriceList />}
          handle={{
            title: <span>Pricelist</span>,
          }}
        />
        <Route
          path="statistics"
          element={<Statistics />}
          handle={{
            title: <span>Statistics</span>,
          }}
        />
        <Route
          path="present"
          element={<Present />}
          handle={{
            title: <span>Present</span>,
          }}
        />
        <Route path="members/:page" element={<SelectMemberFromSurnameRange />} />
        <Route path="members" element={<Navigate to="/" />} />
      </Route>
    </Route>
  );
};

export const AppContainer = () => {
  return (
    <Routes>
      <Route
        element={
          <>
            <RedirectWhenIdle />
            <Outlet />
          </>
        }
      >
        <Route path="/loading" element={<Loading />} />
        <Route
          path="*"
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          <Route index element={<SurnameRanges />} />
          <Route path="settings" element={<Settings />} />
          <Route path="compucie" element={<Compucie />} />
          <Route path="prominent" element={<Prominent />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="committees" element={<Committees />} />
          <Route path="committees/:page" element={<SelectMemberFromCommittee />} />
          <Route path="recent" element={<RecentMembers />} />
          <Route path="products" element={<Products />} />
          <Route path="products/pricelist" element={<PriceList />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="present" element={<Present />} />
          <Route path="members/:page" element={<SelectMemberFromSurnameRange />} />
          <Route path="members" element={<Navigate to="/" />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppContainer;
