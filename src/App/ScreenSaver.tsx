import React from "react";
import {useHistory} from "react-router";

type Props = {
  goHome: () => void;
  goToScreenSaver: () => void;
};

export const SCREEN_SAVER_TIMEOUT = 30000;

const ScreenSaver: React.FC<Props> = ({goHome, goToScreenSaver}) => {
  const history = useHistory();
  const {listen, location} = history;

  const [pathname, setPathname] = React.useState(location.pathname);
  React.useEffect(() => {
    return listen((location) => setPathname(location.pathname));
  }, [listen, setPathname]);

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
