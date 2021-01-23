import React from "react";
import {Layout} from "./../Layout/Layout";
import {AppContent} from "./AppContent";
import "bootstrap/dist/css/bootstrap.css";
import "./FontAwesome";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import {useLocation} from "react-router-dom";

const App = (props: any) => {
  const {pathname} = useLocation();

  if (pathname === "/loading") {
    return <AppContent />;
  }

  return (
    <Layout {...props}>
      <AppContent />
    </Layout>
  );
};

export default App;
