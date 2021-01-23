import React from "react";

const RetryAll = ({orders, buy}: any) => (
  <button
    className="btn btn-success"
    onClick={() => orders.forEach((order: any) => buy(order.order))}
  >
    Retry all
  </button>
);

export default RetryAll;
