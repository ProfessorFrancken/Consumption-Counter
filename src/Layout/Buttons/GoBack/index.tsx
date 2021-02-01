import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectMember} from "actions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useHistory} from "react-router-dom";
import {queuedOrderSelector} from "selectors";

const GoBack = () => {
  const dispatch = useDispatch();
  const queuedOrder = useSelector(queuedOrderSelector);
  const {location, goBack} = useHistory();

  if (!queuedOrder && location.pathname === "/") {
    return null;
  }

  const onClick = () => {
    if (queuedOrder) {
      dispatch(selectMember(queuedOrder.order.member));
    } else {
      goBack();
    }
  };

  return (
    <button className="button backButton" onClick={onClick}>
      <FontAwesomeIcon icon={"arrow-circle-left"} size="lg" />
      <span style={{marginLeft: ".5em"}}>
        {queuedOrder ? queuedOrder.order.member.fullname : "Go back"}
      </span>
    </button>
  );
};

export default GoBack;
