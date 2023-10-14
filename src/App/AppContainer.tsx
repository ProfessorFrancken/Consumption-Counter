import {
  Navigate,
  Routes,
  Route,
  Outlet,
  createRoutesFromElements,
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

export const createAppRoutes = (
  ApplicationProvidersComponent: typeof ApplicationProviders
) => {
  return createRoutesFromElements(
    <Route
      element={
        <ApplicationProvidersComponent>
          <ScreenSaver />
          <Outlet />
        </ApplicationProvidersComponent>
      }
    >
      <Route path="/loading" element={<Loading />} />
      <Route
        path=""
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
