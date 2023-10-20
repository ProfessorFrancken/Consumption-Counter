import React from "react";
import {AuthenticationProvider} from "./components/authentication/context";
import {OrderProvider} from "./components/orders-context";
import "./index.css";
import {QueuedOrdersProvider} from "App/QueuedOrdersContext";

export const ApplicationProviders: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  return (
    <AuthenticationProvider>
      <QueuedOrdersProvider>
        <OrderProvider>{children}</OrderProvider>
      </QueuedOrdersProvider>
    </AuthenticationProvider>
  );
};
