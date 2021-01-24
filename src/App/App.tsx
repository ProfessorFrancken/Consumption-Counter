import React from "react";
import {Layout} from "./../Layout/Layout";
import {AppContent} from "./AppContent";
import "bootstrap/dist/css/bootstrap.css";
import "./FontAwesome";
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
