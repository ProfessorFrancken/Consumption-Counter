import React from "react";
import {QueuedOrder} from ".";

type Props = {
  orders: QueuedOrder[];
  buy: (order: QueuedOrder["order"]) => void;
};

const RetryAll = ({orders, buy}: Props) => (
  <button
    className="btn btn-success"
    onClick={() => orders.forEach((order: any) => buy(order.order))}
  >
    Retry all
  </button>
);

export default RetryAll;
