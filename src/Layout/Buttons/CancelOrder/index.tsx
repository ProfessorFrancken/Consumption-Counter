import React from "react";
import {connect} from "react-redux";
import {cancelOrder} from "actions";
import {queuedOrderSelector} from "selectors";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Price from "App/Price";

const products = (order: any) =>
  order.products.length === 1 ? order.products[0].name : "multiple products";

const CancelOrder = ({onClick, queuedOrder}: any) => {
  if (queuedOrder === null) {
    return null;
  }

  return (
    <button className="button cancelButton" onClick={() => onClick(queuedOrder)}>
      <FontAwesomeIcon icon={"times-circle"} size="lg" />
      <span style={{marginLeft: ".5em"}}>
        Cancel buying {products(queuedOrder.order)} for{" "}
        <Price products={queuedOrder.order.products} />
      </span>
    </button>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  onClick: (order: any) => dispatch(cancelOrder(order.order)),
});

const mapStateToProps = (state: any) => ({
  queuedOrder: queuedOrderSelector(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(CancelOrder);
