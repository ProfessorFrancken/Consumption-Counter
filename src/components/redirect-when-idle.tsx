import React from "react";
import {useLocation, useNavigate} from "react-router";

export const SCREEN_SAVER_TIMEOUT = 30000;

const RedirectWhenIdle = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [pathname, setPathname] = React.useState(location.pathname);
  React.useEffect(() => {
    return setPathname(location.pathname);
  }, [location, setPathname]);

  React.useEffect(() => {
    if (pathname === "/statistics") {
      return;
    }
    if (pathname === "/loading") {
      return;
    }

    const screenSaver =
      pathname === "/"
        ? setTimeout(() => navigate("/statistics"), 2 * SCREEN_SAVER_TIMEOUT)
        : setTimeout(() => navigate("/"), SCREEN_SAVER_TIMEOUT);

    return () => {
      clearTimeout(screenSaver);
    };
  }, [pathname, navigate]);
  return null;
};

export default RedirectWhenIdle;
