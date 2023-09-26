import React from "react";
import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  MemoryRouter,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import {AuthenticationProvider} from "App/Settings/Authentication/Context";
import {OrderProvider} from "App/Products/OrdersContext";
import {ProductsProvider} from "App/Products/ProductsContext";
import "./index.css";
import {CommitteesProvider} from "App/Committees/CommitteesContext";
import {BoardsProvider} from "App/Prominent/BoardsContext";
import {MembersProvider} from "App/Members/Context";
import {QueuedOrdersProvider} from "App/QueuedOrdersContext";
import {ActivitiesProvider} from "App/Activities/ActivitiesContext";
import {StatisticsProvider} from "App/Statistics/StatisticsContext";
import {TransactionsProvider} from "App/Transactions/TransactionsContext";

export const ApplicationProviders: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  return (
    <AuthenticationProvider>
      <QueuedOrdersProvider>
        <ProductsProvider>
          <MembersProvider>
            <CommitteesProvider>
              <BoardsProvider>
                <OrderProvider>
                  <ActivitiesProvider>
                    <StatisticsProvider>
                      <TransactionsProvider>{children}</TransactionsProvider>
                    </StatisticsProvider>
                  </ActivitiesProvider>
                </OrderProvider>
              </BoardsProvider>
            </CommitteesProvider>
          </MembersProvider>
        </ProductsProvider>
      </QueuedOrdersProvider>
    </AuthenticationProvider>
  );
};
