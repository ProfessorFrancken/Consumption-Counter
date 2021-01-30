import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {goBack} from "actions";
import {goBackText} from "./selectors";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useLocation} from "react-router-dom";

const GoBack = () => {
  const dispatch = useDispatch();
  const onClick = () => dispatch(goBack());
  const text = useSelector(goBackText);

  const {pathname} = useLocation();

  if (text === "Go back" && pathname === "/") {
    return null;
  }

  return (
    <button className="button backButton" onClick={onClick}>
      <FontAwesomeIcon icon={"arrow-circle-left"} size="lg" />
      <span style={{marginLeft: ".5em"}}>{text}</span>
    </button>
  );
};

export default GoBack;
