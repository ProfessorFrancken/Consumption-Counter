import React from "react";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useProducts} from "App/Products/ProductsContext";
import {QueryObserverResult} from "react-query";
import {useCommittees} from "App/Committees/CommitteesContext";
import {useBoards} from "App/Prominent/BoardsContext";
import {useMembers} from "App/Members/Context";
import {useActivities} from "App/Activities/ActivitiesContext";
import {useStatistics} from "App/Statistics/StatisticsContext";

type Feature = {
  query: QueryObserverResult;
  label: string;
};

const ariaLabel = (feature: Feature) => {
  if (feature.query.isLoading) {
    return `Loading ${feature.label}`;
  }
  if (feature.query.isSuccess) {
    return `Succesfully loaded ${feature.label}`;
  }
  if (feature.query.isError) {
    return `Failed loading ${feature.label}`;
  }
};

const LoadFeatureListItem = ({feature}: {feature: Feature}) => {
  return (
    <li className="font-weight-bold my-3" aria-label={ariaLabel(feature)}>
      {feature.query.isLoading || feature.query.isFetching ? (
        <FontAwesomeIcon icon={"spinner"} spin fixedWidth className="mr-1 text-muted" />
      ) : (
        (feature.query.isSuccess || (feature.query.isIdle && feature.query.data)) && (
          <FontAwesomeIcon
            icon={"check-circle"}
            fixedWidth
            className="mr-1 text-success"
          />
        )
      )}
      {feature.query.isError && (
        <FontAwesomeIcon icon={"times-circle"} fixedWidth className="mr-1 text-danger" />
      )}
      {feature.label}...
    </li>
  );
};

const LoadingScreen = () => {
  const {productsQuery} = useProducts();
  const {membersQuery} = useMembers();
  const {committeesQuery} = useCommittees();
  const {boardsQuery} = useBoards();
  const {activitiesQuery} = useActivities();
  const {statisticsQuery} = useStatistics();

  const queries = [
    productsQuery,
    membersQuery,
    committeesQuery,
    boardsQuery,
    activitiesQuery,
    statisticsQuery,
  ];

  const applicationIsLoaded = !queries.some(
    (query) => query.isLoading || !query.isSuccess || query.isFetching
  );

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
