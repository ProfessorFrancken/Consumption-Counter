import React from 'react';
import { connect } from 'react-redux';
import Authenticate from './Authentication';
import Price from './../Transactions/Price';
import { groupBy, map } from 'lodash';
import { cancelOrder, buyOrder } from './../../actions';
import Moment from 'react-moment';

// Show all products that were bought and the amount of times they were bought
const listOfProducts = products =>
  map(
    groupBy(products, product => product.id),
    product =>
      product.length === 1
        ? `${product[0].name}`
        : `${product[0].name} (${product.length}x)`
  ).join(', ');

const status = order =>
  order.state + (order.fails > 0 ? ` (failed ${order.fails}x)` : '');

const Settings = ({ orders, cancel, buy }) => (
  <div>
    <Authenticate />
    <div className="mb-5 bg-light">
      <h2 className="h4 font-weight-normal p-3">Queud Orders</h2>
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
            <tr key={idx}>
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
                <button
                  className="btn btn-link text-success mr-2"
                  onClick={() => buy(order.order)}
                >
                  Retry now
                </button>

                <button
                  className="btn btn-link text-danger"
                  onClick={() => cancel(order.order)}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const mapStateToProps = state => ({
  orders: state.queuedOrders
});

const mapDispatchToProps = dispatch => ({
  cancel: order => dispatch(cancelOrder(order)),
  buy: order => dispatch(buyOrder(order))
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
