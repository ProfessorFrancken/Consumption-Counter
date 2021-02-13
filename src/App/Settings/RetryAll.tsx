import React from "react";
import {QueuedOrder, OrderedOrder} from "App/QueuedOrdersContext";

type Props = {
  orders: QueuedOrder[];
  buy: (order: OrderedOrder) => void;
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
