import React from "react";
import {AuthenticationProvider} from "App/Settings/Authentication/Context";
import {OrderProvider} from "App/Products/OrdersContext";
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
