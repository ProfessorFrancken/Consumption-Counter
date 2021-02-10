import React from "react";
import Price from "./../Price";
import {groupBy, map} from "lodash";
import Moment from "react-moment";
import {Product} from "App/Products/OrdersContext";
import {QueuedOrder} from ".";

// Show all products that were bought and the amount of times they were bought
const listOfProducts = (products: Pick<Product, "id" | "name" | "price">[]) =>
  map(
    groupBy(products, (product: any) => product.id),
    (product: any) =>
      product.length === 1
        ? `${product[0].name}`
        : `${product[0].name} (${product.length}x)`
  ).join(", ");

const status = (order: QueuedOrder) =>
  order.state + (order.fails > 0 ? ` (failed ${order.fails}x)` : "");

type Props = {
  order: QueuedOrder;
  buy: (order: QueuedOrder["order"]) => void;
  cancel: (order: QueuedOrder["order"]) => void;
};
const FailedOrder = ({order, buy, cancel}: Props) => (
  <tr>
    <th scope="row">
      <Moment fromNow interval={1000} unix>
        {order.order.ordered_at / 1000}
      </Moment>
    </th>
    <td>{order.order.member.fullname}</td>
    <td>{listOfProducts(order.order.products)}</td>
    <td className="text-right">
      <Price products={order.order.products} />
    </td>
    <td className="text-right">{status(order)}</td>
    <td className="text-right">
      <button className="btn btn-link text-success mr-2" onClick={() => buy(order.order)}>
        Retry now
      </button>

      <button className="btn btn-link text-danger" onClick={() => cancel(order.order)}>
        Cancel
      </button>
    </td>
  </tr>
);

export default FailedOrder;
