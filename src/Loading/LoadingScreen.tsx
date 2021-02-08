import React from "react";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {LOADING_STATE} from "./reducers";
import {useSelector} from "react-redux";
import {loadingScreenSelector} from "./selectors";
import {useProducts} from "App/Products/ProductsContext";
import {QueryObserverResult} from "react-query";
import {useCommittees} from "App/Committees/CommitteesContext";

type Feature = {
  query:
    | QueryObserverResult
    | Pick<QueryObserverResult, "isLoading" | "isSuccess" | "isError">;
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
      {feature.query.isLoading && (
        <FontAwesomeIcon icon={"spinner"} spin fixedWidth className="mr-1 text-muted" />
      )}
      {feature.query.isSuccess && (
        <FontAwesomeIcon icon={"check-circle"} fixedWidth className="mr-1 text-success" />
      )}
      {feature.query.isError && (
        <FontAwesomeIcon icon={"times-circle"} fixedWidth className="mr-1 text-danger" />
      )}
      {feature.label}...
    </li>
  );
};

const LoadingScreen = () => {
  const {state, features} = useSelector(loadingScreenSelector);
  const {productsQuery} = useProducts();
  const {committeesQuery} = useCommittees();

  return (
    <div
      className="h-100 d-flex justify-content-center align-items-center"
      style={{paddingBottom: "100px"}}
    >
      <div className="bg-white p-5 rounded">
        <h2 className="">Loading consumption counter...</h2>
        <ul className="feature-list my-4 list-unstyled">
          {features.map((feature: any, idx: any) => (
            <LoadFeatureListItem
              key={idx}
              feature={{
                label: feature.label,
                query: {
                  isSuccess: feature.loading === LOADING_STATE.SUCCESS,
                  isError: feature.loading === LOADING_STATE.FAILURE,
                  isLoading: feature.loading === LOADING_STATE.REQUESTING,
                },
              }}
            />
          ))}
          <LoadFeatureListItem feature={{label: "Products", query: productsQuery}} />
          <LoadFeatureListItem feature={{label: "Committees", query: committeesQuery}} />
        </ul>
        {state === LOADING_STATE.SUCCESS && productsQuery.isSuccess ? (
          <NavLink exact to="/" className="tile button p-4">
            Open application
          </NavLink>
        ) : null}
        {state === LOADING_STATE.REQUESTING && !productsQuery.isSuccess ? (
          <button
            className="d-block text-center w-100 bg-secondary tile button p-4"
            disabled
          >
            Loading...
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default LoadingScreen;
