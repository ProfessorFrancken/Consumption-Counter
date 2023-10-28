import {
  QueuedOrder,
  OrderedOrder,
  useQueuedOrders,
} from "./../../../components/orders/queued-orders-context";
import Moment from "react-moment";
import ProductsPrice from "../../../components/products-price";
import {groupBy, map} from "lodash";
import {Product} from "queries/products";
import AuthenticationForm from "./../../../components/authentication/authentication-form";
import {useAuthentication} from "./../../../components/authentication/context";

// Show all products that were bought and the amount of times they were bought
const listOfProducts = (products: Pick<Product, "id" | "name" | "price">[]) =>
  map(
    groupBy(products, (product) => product.id),
    (product) =>
      product.length === 1
        ? `${product[0].name}`
        : `${product[0].name} (${product.length}x)`
  ).join(", ");

const status = (order: QueuedOrder) =>
  order.state + (order.fails > 0 ? ` (failed ${order.fails}x)` : "");

type Props = {
  order: QueuedOrder;
  buy: (order: OrderedOrder) => void;
  cancel: (order: OrderedOrder) => void;
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
      <ProductsPrice products={order.order.products} />
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

const RetryAll = ({
  orders,
  buy,
}: {
  orders: QueuedOrder[];
  buy: (order: OrderedOrder) => void;
}) => (
  <button
    className="btn btn-success"
    onClick={() => orders.forEach((order) => buy(order.order))}
  >
    Retry all
  </button>
);

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
          {orders.map((order, idx) => (
            <FailedOrder order={order} buy={buy} cancel={cancel} key={idx} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Show all products that were bought and the amount of times they were bought
const Settings = () => {
  return (
    <div>
      <AuthenticationForm />
      <QueuedOrders />
    </div>
  );
};

export default Settings;
