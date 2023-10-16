import React from "react";
import {AuthenticationProvider} from "App/Settings/Authentication/Context";
import {OrderProvider} from "App/Products/OrdersContext";
import "./index.css";
import {CommitteesProvider} from "App/Committees/CommitteesContext";
import {MembersProvider} from "App/Members/Context";
import {QueuedOrdersProvider} from "App/QueuedOrdersContext";
import {ActivitiesProvider} from "App/Activities/ActivitiesContext";
import {StatisticsProvider} from "App/Statistics/StatisticsContext";

export const ApplicationProviders: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  return (
    <AuthenticationProvider>
      <QueuedOrdersProvider>
        <MembersProvider>
          <CommitteesProvider>
            <OrderProvider>
              <ActivitiesProvider>
                <StatisticsProvider>{children}</StatisticsProvider>
              </ActivitiesProvider>
            </OrderProvider>
          </CommitteesProvider>
        </MembersProvider>
      </QueuedOrdersProvider>
    </AuthenticationProvider>
  );
};
