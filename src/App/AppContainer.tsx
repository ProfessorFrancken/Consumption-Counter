import React from "react";
import {useSelector} from "react-redux";
import {backgroundSelector, failedOrdersSelector} from "./selectors";
import {useHistory} from "react-router-dom";
import ScreenSaver from "./ScreenSaver";
import App from "./App";

const AppContainer = () => {
  const menuItems = useSelector((state: any) => state.menuItems);
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
