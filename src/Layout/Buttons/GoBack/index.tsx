import React from "react";
import {connect} from "react-redux";
import {goBack} from "actions";
import {goBackText} from "./selectors";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useLocation} from "react-router-dom";

const GoBack = ({text, onClick}: any) => {
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

const mapStateToProps = (state: any) => ({
  text: goBackText(state),
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    onClick: () => dispatch(goBack()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GoBack);
