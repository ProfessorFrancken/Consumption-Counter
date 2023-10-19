import {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {productsQueryOptions} from "App/Products/ProductsContext";
import {
  QueryObserver,
  QueryObserverResult,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {committeeMembersQueryOptions} from "App/Committees/CommitteesContext";
import {boardMembersQueryOptions} from "App/Prominent/BoardsContext";
import {membersQueryOptions} from "App/Members/Context";
import {activitiesQueryOptions} from "App/Activities/ActivitiesContext";
import {statisticsQueryOptions} from "App/Statistics/StatisticsContext";
import moment from "moment";
import {ordersQueryOptions} from "App/Transactions/TransactionsContext";

type Feature = {
  query: QueryObserverResult | undefined;
  label: string;
};

const ariaLabel = (feature: Feature) => {
  if (feature.query === undefined || feature.query.status === "pending") {
    return `Loading ${feature.label}`;
  }
  if (feature.query.status === "success") {
    return `Succesfully loaded ${feature.label}`;
  }
  if (feature.query.status === "error") {
    return `Failed loading ${feature.label}`;
  }
};

const LoadFeatureListItem = ({feature}: {feature: Feature}) => {
  if (feature.query === undefined) {
    return null;
  }
  return (
    <li className="font-weight-bold my-3" aria-label={ariaLabel(feature)}>
      {feature.query === undefined || feature.query.status === "pending" ? (
        <FontAwesomeIcon icon={"spinner"} spin fixedWidth className="mr-1 text-muted" />
      ) : feature.query.status === "success" ||
        (feature.query.fetchStatus !== "fetching" && feature.query.data) ? (
        <FontAwesomeIcon icon={"check-circle"} fixedWidth className="mr-1 text-success" />
      ) : (
        feature.query.status === "error" && (
          <FontAwesomeIcon
            icon={"times-circle"}
            fixedWidth
            className="mr-1 text-danger"
          />
        )
      )}
      {feature.label}...
    </li>
  );
};

const LoadingScreen = () => {
  const productsQuery = useQuery(productsQueryOptions());
  const membersQuery = useQuery(membersQueryOptions());
  const committeesQuery = useQuery(committeeMembersQueryOptions());
  const boardsQuery = useQuery(boardMembersQueryOptions());

  const after = moment().subtract(2, "years").format("YYYY-MM-DD");
  const before = moment().add(1, "years").format("YYYY-MM-DD");
  const activitiesQuery = useQuery(activitiesQueryOptions({after, before}));
  const statisticsQuery = useQuery(statisticsQueryOptions());
  const ordersQuery = useQuery(ordersQueryOptions());

  const queries = [
    productsQuery,
    membersQuery,
    committeesQuery,
    boardsQuery,
    activitiesQuery,
    statisticsQuery,
    ordersQuery,
  ].filter((x) => x !== undefined);

  const applicationIsLoaded = !queries.some((query) => query?.status === "pending");

  return (
    <div
      className="h-100 d-flex justify-content-center align-items-center"
      style={{paddingBottom: "100px"}}
    >
      <div className="bg-white p-5 rounded">
        <h2 className="">Loading consumption counter...</h2>
        <ul className="feature-list my-4 list-unstyled">
          <LoadFeatureListItem feature={{label: "Products", query: productsQuery}} />
          <LoadFeatureListItem feature={{label: "Members", query: membersQuery}} />
          <LoadFeatureListItem feature={{label: "Committees", query: committeesQuery}} />
          <LoadFeatureListItem feature={{label: "Boards", query: boardsQuery}} />
          <LoadFeatureListItem feature={{label: "Activities", query: activitiesQuery}} />
          <LoadFeatureListItem feature={{label: "Statistics", query: statisticsQuery}} />
          <LoadFeatureListItem feature={{label: "Orders", query: ordersQuery}} />
        </ul>
        {applicationIsLoaded ? (
          <NavLink to="/" className="tile button p-4">
            Open application
          </NavLink>
        ) : (
          <button
            className="d-block text-center w-100 bg-secondary tile button p-4"
            disabled
          >
            Loading...
          </button>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
