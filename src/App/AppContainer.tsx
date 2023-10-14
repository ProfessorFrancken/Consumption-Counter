import React from "react";
import {
  Navigate,
  Routes,
  Route,
  Outlet,
  useNavigate,
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
import {useBackgroundFromOrder, useFailedOrders} from "./QueuedOrdersContext";
import {Layout} from "../Layout/Layout";
import Loading from "../Loading";
import {useCommittees} from "./Committees/CommitteesContext";
import {useBoards} from "./Prominent/BoardsContext";
import {useMembers} from "./Members/Context";
import {useStatistics, useStatisticsQuery} from "./Statistics/StatisticsContext";
import {ApplicationProviders} from "ApplicationProviders";
import "./FontAwesome";

const useMenuItems = () => {
  const {committeesQuery} = useCommittees();
  const {boardsQuery} = useBoards();
  const {membersQuery} = useMembers();
  const statisticsQuery = useStatisticsQuery();

  return [
    {
      icon: "chess-queen",
      url: "/prominent",
      loading: boardsQuery.isLoading,
      label: "Prominent",
    },
    {
      icon: "home",
      url: "/",
      loading: membersQuery.isLoading,
      label: "Home",
    },
    {
      icon: "clock",
      url: "/recent",
      loading: false,
      label: "Recent",
    },
    {
      icon: "users",
      url: "/committees",
      loading: committeesQuery.isLoading,
      label: "Committees",
    },
    {
      icon: "chart-column",
      url: "/statistics",
      loading: statisticsQuery.isLoading,
      label: "Statistics",
    },
    {
      icon: "map-marker-alt",
      url: "/present",
      loading: false,
      label: "Present",
    },
  ];
};

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
