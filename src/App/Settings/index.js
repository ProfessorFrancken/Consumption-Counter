import React, { Component } from 'react';
import { connect } from 'react-redux';
import Authenticate from './Authentication';
import Price from './../Transactions/Price';
import { groupBy, map } from 'lodash';
import moment from 'moment';
import { cancelOrder, buyOrder } from './../../actions';

// Show all products that were bought and the amount of times they were bought
const listOfProducts = products =>
  map(
    groupBy(products, product => product.id),
    product =>
      product.length === 1
        ? `${product[0].name}`
        : `${product[0].name} (${product.length}x)`
  ).join(', ');

const status = order => order.state;

const Settings = ({ orders, cancel, buy }) => (
  <div>
    <Authenticate />
    <div>
      <h2>Queud Orders</h2>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Ordered at</th>
            <th scope="col">Member</th>
            <th scope="col">Products</th>
            <th scope="col">Price</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={idx}>
              <th scope="row">{moment(order.order.ordered_at).calendar()}</th>
              <td>
                {order.order.member.firstName} {order.order.member.surname}
              </td>
              <td>{listOfProducts(order.order.products)}</td>
              <td>
                <Price products={order.order.products} />
              </td>
              <td>{status(order)}</td>
              <td>
                <button
                  className="btn btn-outline-success mr-2"
                  onClick={() => buy(order.order)}
                >
                  Retry now
                </button>

                <button
                  className="btn btn-outline-danger"
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
