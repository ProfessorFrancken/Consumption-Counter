import React from "react";
import ScreenSaver from "./ScreenSaver";
import App from "./App";
import {useCommittees} from "./Committees/CommitteesContext";
import {useBoards} from "./Prominent/BoardsContext";
import {useMembers} from "./Members/Context";
import {useBackgroundFromOrder, useFailedOrders} from "./QueuedOrdersContext";
import {useStatistics} from "./Statistics/StatisticsContext";
import {useNavigate} from "react-router";

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

const AppContainer = () => {
  const menuItems = useMenuItems();
  const background = useBackgroundFromOrder();
  const failedOrders = useFailedOrders();
  const navigate = useNavigate();

  const goToCompucieScreen = () => navigate("/compucie");
  const goToProminent = () => navigate("/prominent");

  // Screensaver
  const goHome = () => navigate("/");
  const goToScreenSaver = () => navigate("/statistics");

  return (
    <>
      <ScreenSaver goHome={goHome} goToScreenSaver={goToScreenSaver} />
      <App
        menuItems={menuItems}
        background={background}
        failedOrders={failedOrders}
        goToCompucieScreen={goToCompucieScreen}
        goToProminent={goToProminent}
        goHome={goHome}
      />
    </>
  );
};

export default AppContainer;
