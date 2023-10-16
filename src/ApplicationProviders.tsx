import React from "react";
import {AuthenticationProvider} from "App/Settings/Authentication/Context";
import {OrderProvider} from "App/Products/OrdersContext";
import "./index.css";
import {MembersProvider} from "App/Members/Context";
import {QueuedOrdersProvider} from "App/QueuedOrdersContext";

export const ApplicationProviders: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  return (
    <AuthenticationProvider>
      <QueuedOrdersProvider>
        <MembersProvider>
          <OrderProvider>{children}</OrderProvider>
        </MembersProvider>
      </QueuedOrdersProvider>
    </AuthenticationProvider>
  );
};
