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
import ScreenSaver from "./ScreenSaver";
import SurnameRanges from "App/SurnameRanges";
import SelectMemberFromSurnameRange from "App/SurnameRanges/SelectMemberFromSurnameRange";
import BuyProducts from "App/Products/";
import PriceList from "App/Products/PriceList/";
import Prominent from "./Prominent/";
import Committees from "./Committees/";
import SelectMemberFromCommittee from "./Committees/SelectMemberFromCommittee";
import RecentMembers from "./Recent/";
import Compucie from "./Committees/Compucie/";
import Authenticate from "./Settings/Authentication/";
import Settings from "./Settings/";
import Statistics from "./Statistics/";
import Present from "./Present/";
import {Layout} from "../Layout/Layout";
import Loading from "../Loading";
import {ApplicationProviders} from "ApplicationProviders";
import "./FontAwesome";
import {UnauthenticatedLayout} from "./UnauthenticatedLayout";
import AuthenticationForm from "./Settings/Authentication/AuthenticationForm";
import LoadingScreen from "../Loading";
import {Suspense} from "react";
import {QueryClient} from "@tanstack/react-query";
import {membersQueryOptions} from "./Members/Context";
import {productsQueryOptions} from "./Products/ProductsContext";
import {committeeMembersQueryOptions} from "./Committees/CommitteesContext";
import {boardMembersQueryOptions} from "./Prominent/BoardsContext";
import {statisticsQueryOptions} from "./Statistics/StatisticsContext";
import {ordersQueryOptions} from "./Transactions/TransactionsContext";

function isErrorResponse(error: any): error is ErrorResponse {
  return (
    error != null &&
    typeof error.status === "number" &&
    typeof error.statusText === "string"
  );
}

const ErrorBoundary = () => {
  const error = useRouteError();

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

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Await resolve={data.queries}>
        <ScreenSaver />
        <Outlet />
      </Await>
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
      element={
        <ApplicationProvidersComponent>
          <Outlet />
        </ApplicationProvidersComponent>
      }
    >
      <Route
        element={<ErrorBoundaryLayout />}
        errorElement={<ErrorBoundary />}
        loader={async () => {
          // TODO: figure out why Mirage isn't working immediately
          await sleep(500);

          // Preload all the data that we need to show any of the screens,
          // once this is done we can act as if the application is offline first
          const queries = Promise.all([
            queryClient.ensureQueryData(membersQueryOptions()),
            queryClient.ensureQueryData(productsQueryOptions()),
            queryClient.ensureQueryData(committeeMembersQueryOptions()),
            queryClient.ensureQueryData(boardMembersQueryOptions()),
            queryClient.ensureQueryData(statisticsQueryOptions()),
            queryClient.ensureQueryData(ordersQueryOptions()),
          ]);

          // If we didn't finish loading the data in half a second, then
          // defer the queries and show a loading screen
          await Promise.any([queries, sleep(200)]);

          return defer({queries});
        }}
      >
        <Route path="/loading" element={<Loading />} />
        <Route
          path=""
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
          loader={() => {
            //console.log("loading...");
            return null;
          }}
        >
          <Route index element={<SurnameRanges />} />
          <Route path="settings" element={<Settings />} />
          <Route path="authenticate" element={<Authenticate />} />
          <Route path="compucie" element={<Compucie />} />
          <Route path="prominent" element={<Prominent />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="committees" element={<Committees />} />
          <Route path="committees/:page" element={<SelectMemberFromCommittee />} />
          <Route path="recent" element={<RecentMembers />} />
          <Route path="products" element={<BuyProducts />} />
          <Route path="products/pricelist" element={<PriceList />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="present" element={<Present />} />
          <Route path="members/:page" element={<SelectMemberFromSurnameRange />} />
          <Route path="members" element={<Navigate to="/" />} />
        </Route>
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
            <ScreenSaver />
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
          <Route path="authenticate" element={<Authenticate />} />
          <Route path="compucie" element={<Compucie />} />
          <Route path="prominent" element={<Prominent />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="committees" element={<Committees />} />
          <Route path="committees/:page" element={<SelectMemberFromCommittee />} />
          <Route path="recent" element={<RecentMembers />} />
          <Route path="products" element={<BuyProducts />} />
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
