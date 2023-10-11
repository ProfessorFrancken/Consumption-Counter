import React from "react";
import {useLocation, useNavigate} from "react-router";

export const SCREEN_SAVER_TIMEOUT = 30000;

const ScreenSaver = () => {
  const navigate = useNavigate();
  const goHome = () => navigate("/");
  const goToScreenSaver = () => navigate("/statistics");

  const location = useLocation();

  const [pathname, setPathname] = React.useState(location.pathname);
  React.useEffect(() => {
    return setPathname(location.pathname);
  }, [location, setPathname]);

  React.useEffect(() => {
    if (pathname === "/statistics") {
      return;
    }

    const screenSaver =
      pathname === "/"
        ? setTimeout(goToScreenSaver, 2 * SCREEN_SAVER_TIMEOUT)
        : setTimeout(goHome, SCREEN_SAVER_TIMEOUT);

    return () => {
      clearTimeout(screenSaver);
    };
  }, [pathname, goToScreenSaver, goHome]);
  return null;
};

export default ScreenSaver;
