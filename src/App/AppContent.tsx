import React from "react";
import {Navigate, Routes, Route, Outlet, useNavigate} from "react-router-dom";
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
import {useStatistics} from "./Statistics/StatisticsContext";

const useMenuItems = () => {
  const {committeesQuery} = useCommittees();
  const {boardsQuery} = useBoards();
  const {membersQuery} = useMembers();
  const {statisticsQuery} = useStatistics();

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
      icon: "chart-bar",
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

export const AppContent = () => {
  const menuItems = useMenuItems();
  const background = useBackgroundFromOrder();
  const failedOrders = useFailedOrders();
  const navigate = useNavigate();

  const goToCompucieScreen = () => navigate("/compucie");
  const goToProminent = () => navigate("/prominent");

  // Screensaver
  const goHome = () => navigate("/");

  return (
    <Routes>
      <Route path="/loading" element={<Loading />} />
      <Route
        path="/"
        element={
          <Layout
            menuItems={menuItems}
            background={background}
            failedOrders={failedOrders}
            goToCompucieScreen={goToCompucieScreen}
            goToProminent={goToProminent}
            goHome={goHome}
          >
            <Outlet />
          </Layout>
        }
      >
        <Route path="/" element={<SurnameRanges />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path="/compucie" element={<Compucie />} />
        <Route path="/prominent" element={<Prominent />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/committees" element={<Committees />} />
        <Route path="/committees/:page" element={<SelectMemberFromCommittee />} />
        <Route path="/pricelist" element={<PriceList />} />
        <Route path="/recent" element={<RecentMembers />} />
        <Route path="/products" element={<BuyProducts />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/present" element={<Present />} />
        <Route path="/members/:page" element={<SelectMemberFromSurnameRange />} />
        <Route path="/members" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};
