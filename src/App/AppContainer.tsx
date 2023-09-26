import React from "react";
import ScreenSaver from "./ScreenSaver";
import {useNavigate} from "react-router";
import {AppContent} from "./AppContent";

const AppContainer = () => {
  // Screensaver
  const navigate = useNavigate();
  const goHome = () => navigate("/");
  const goToScreenSaver = () => navigate("/statistics");

  return (
    <>
      <ScreenSaver goHome={goHome} goToScreenSaver={goToScreenSaver} />
      <AppContent />
    </>
  );
};

export default AppContainer;
