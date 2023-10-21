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
import RedirectWhenIdle from "./../components/redirect-when-idle";
import SurnameRanges from "../routes/index";
import SelectMemberFromSurnameRange from "../routes/members/index";
import Products from "../routes/products/index";
import PriceList from "../routes/products/pricelist/index";
import Prominent from "../routes/prominent/index";
import Committees from "../routes/committees/index";
import SelectMemberFromCommittee from "../routes/committees/members/index";
import RecentMembers from "./../routes/recent/index";
import Compucie from "../routes/compucie/index";
import Settings from "./../routes/compucie/settings/index";
import Statistics from "../routes/statistics/index";
import Present from "./../routes/present/index";
import {Layout} from "../components/layout/layout";
import {ApplicationProviders} from "ApplicationProviders";
import "./../components/font-awesome";
import {UnauthenticatedLayout} from "./../components/layout/unauthenticated-layout";
import AuthenticationForm from "../components/authentication/authentication-form";
import Loading from "../routes/loading/index";
import {Suspense} from "react";
import {QueryClient} from "@tanstack/react-query";
import {productsQueryOptions} from "../queries/products";
import {committeeMembersQueryOptions} from "../queries/committees";
import {boardMembersQueryOptions} from "../queries/boards";
import {statisticsQueryOptions} from "./../queries/statistics";
import {ordersQueryOptions} from "../queries/orders";
import moment from "moment";
import {activitiesQueryOptions} from "../queries/activities";
import {membersQueryOptions} from "../queries/members";

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
      <Await resolve={data.queries}>
        <RedirectWhenIdle />
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
          const after = moment().subtract(2, "years").format("YYYY-MM-DD");
          const before = moment().add(1, "years").format("YYYY-MM-DD");
          const queries = Promise.all([
            queryClient.ensureQueryData(membersQueryOptions()),
            queryClient.ensureQueryData(productsQueryOptions()),
            queryClient.ensureQueryData(committeeMembersQueryOptions()),
            queryClient.ensureQueryData(boardMembersQueryOptions()),
            queryClient.ensureQueryData(statisticsQueryOptions()),
            queryClient.ensureQueryData(ordersQueryOptions()),
            queryClient.ensureQueryData(activitiesQueryOptions({after, before})),
          ]);

          // If we didn't finish loading the data in half a second, then
          // defer the queries and show a loading screen
          let waitTime = {time: 0};

          console.log("waiting?");
          await Promise.any([queries, sleep(200).then(() => (waitTime.time = 600))]);
          console.log("done waitting");

          console.log(waitTime);

          if (waitTime.time !== 0) {
            console.log("sleeping?");
            //await sleep(waitTime);
          }

          return defer({
            queries: queries.then(async (data) => {
              console.log("ahoi@", waitTime);
              await sleep(waitTime.time);
              console.log("done sleeping");
              return data;
            }),
          });
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
