import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {backgroundSelector, failedOrdersSelector} from "./selectors";
import {useHistory} from "react-router-dom";
import {push} from "connected-react-router";
import ScreenSaver from "./ScreenSaver";
import App from "./App";

const AppContainer = () => {
  const dispatch = useDispatch();
  const menuItems = useSelector((state: any) => state.menuItems);
  const background = useSelector(backgroundSelector);
  const failedOrders = useSelector(failedOrdersSelector);
  const {listen} = useHistory();

  const goToCompucieScreen = () => dispatch(push("/compucie"));
  const goToProminent = () => dispatch(push("/prominent"));

  // Screensaver
  const goHome = () => dispatch(push("/"));
  const goToScreenSaver = () => dispatch(push("/statistics"));

  return (
    <>
      <ScreenSaver
        // @ts-expect-error ts-migrate(2322) FIXME: Type '{ listen: any; goHome: any; goToScreenSaver:... Remove this comment to see the full error message
        listen={listen}
        goHome={goHome}
        goToScreenSaver={goToScreenSaver}
      />
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
