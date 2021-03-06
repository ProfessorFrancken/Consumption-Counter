import React from "react";
import Authenticate from "./Authentication";
import FailedOrder from "./FailedOrder";
import RetryAll from "./RetryAll";
import {OrderedOrder, useQueuedOrders} from "App/QueuedOrdersContext";

const QueuedOrders = () => {
  const {queuedOrders: orders, cancelOrder, buyOrder} = useQueuedOrders();

  const cancel = (order: OrderedOrder) => cancelOrder(order);
  const buy = (order: OrderedOrder) => buyOrder(order);

  return (
    <div className="mb-5 bg-light">
      <div className="d-flex justify-content-between">
        <h2 className="h4 font-weight-normal p-3">Queued Orders</h2>
        {orders.length > 0 && (
          <div>
            <RetryAll orders={orders} buy={buy} />
          </div>
        )}
      </div>
      <table className="table table-hover">
        <thead className="thead-light">
          <tr>
            <th scope="col">Ordered at</th>
            <th scope="col">Member</th>
            <th scope="col">Products</th>
            <th scope="col" className="text-right">
              Price
            </th>
            <th scope="col" className="text-right">
              Status
            </th>
            <th scope="col" className="text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any, idx: any) => (
            <FailedOrder order={order} buy={buy} cancel={cancel} key={idx} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Show all products that were bought and the amount of times they were bought
const Settings = () => (
  <div>
    <Authenticate />
    <QueuedOrders />
  </div>
);

export default Settings;
