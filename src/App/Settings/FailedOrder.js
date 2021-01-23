import React from "react";
import Price from "./../Price";
import {groupBy, map} from "lodash";
import Moment from "react-moment";

// Show all products that were bought and the amount of times they were bought
const listOfProducts = (products) =>
  map(
    groupBy(products, (product) => product.id),
    (product) =>
      product.length === 1
        ? `${product[0].name}`
        : `${product[0].name} (${product.length}x)`
  ).join(", ");

const status = (order) =>
  order.state + (order.fails > 0 ? ` (failed ${order.fails}x)` : "");

const FailedOrder = ({order, buy, cancel}) => (
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
