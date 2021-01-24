import React from "react";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {LOADING_STATE} from "./reducers";

type Props = {};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'Props'.
const LoadingScreen = ({state, features, done}: Props) => {
  return (
    <div
      className="h-100 d-flex justify-content-center align-items-center"
      style={{paddingBottom: "100px"}}
    >
      <div className="bg-white p-5 rounded">
        <h2 className="">Loading streepsystem data...</h2>
        <ul className="feature-list my-4 list-unstyled">
          {features.map((feature: any, idx: any) => (
            <li key={idx} className="font-weight-bold my-3">
              {feature.loading === LOADING_STATE.REQUESTING && (
                <FontAwesomeIcon
                  icon={"spinner"}
                  spin
                  fixedWidth
                  className="mr-1 text-muted"
                />
              )}
              {feature.loading === LOADING_STATE.SUCCESS && (
                <FontAwesomeIcon
                  icon={"check-circle"}
                  fixedWidth
                  className="mr-1 text-success"
                />
              )}
              {feature.loading === LOADING_STATE.FAILURE && (
                <FontAwesomeIcon
                  icon={"times-circle"}
                  fixedWidth
                  className="mr-1 text-danger"
                />
              )}
              {feature.label}...
            </li>
          ))}
        </ul>
        {state === LOADING_STATE.SUCCESS && (
          <NavLink exact to="/" className="tile button p-4">
            Open application
          </NavLink>
        )}
        {state === LOADING_STATE.REQUESTING && (
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
