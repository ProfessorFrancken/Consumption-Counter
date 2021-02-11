import React from "react";
import {useOrder} from "App/Products/OrdersContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useHistory} from "react-router-dom";
import {useQueuedOrders} from "App/QueuedOrdersContext";

const GoBack = () => {
  const {queuedOrder} = useQueuedOrders();
  const {location, goBack} = useHistory();
  const {selectMember} = useOrder();

  if (!queuedOrder && location.pathname === "/") {
    return null;
  }

  const onClick = () => {
    if (queuedOrder) {
      selectMember(queuedOrder.order.member);
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
