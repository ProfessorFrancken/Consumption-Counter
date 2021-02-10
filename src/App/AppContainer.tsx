import React from "react";
import {useSelector} from "react-redux";
import {backgroundSelector, failedOrdersSelector} from "./selectors";
import {useHistory} from "react-router-dom";
import ScreenSaver from "./ScreenSaver";
import App from "./App";
import {useCommittees} from "./Committees/CommitteesContext";
import {useBoards} from "./Prominent/BoardsContext";
import {useMembers} from "./Members/Context";

const useMenuItems = () => {
  const {committeesQuery} = useCommittees();
  const {boardsQuery} = useBoards();
  const {membersQuery} = useMembers();
  const menuItems = useSelector((state: any) => state.menuItems);

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
    ...menuItems,
    {
      icon: "users",
      url: "/committees",
      loading: committeesQuery.isLoading,
      label: "Committees",
    },
  ];
};

const AppContainer = () => {
  const menuItems = useMenuItems();
  const background = useSelector(backgroundSelector);
  const failedOrders = useSelector(failedOrdersSelector);
  const {listen, push} = useHistory();

  const goToCompucieScreen = () => push("/compucie");
  const goToProminent = () => push("/prominent");

  // Screensaver
  const goHome = () => push("/");
  const goToScreenSaver = () => push("/statistics");

  return (
    <>
      <ScreenSaver listen={listen} goHome={goHome} goToScreenSaver={goToScreenSaver} />
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
