import React from 'react';
import PropTypes from 'prop-types';
import Price from './Price';
import { groupBy, map } from 'lodash';
import moment from 'moment';

// Show all products that were bought and the amount of times they were bought
const listOfProducts = products =>
  map(
    groupBy(products, product => product.id),
    product =>
      product.length === 1
        ? `${product[0].name}`
        : `${product[0].name} (${product.length}x)`
  ).join(', ');

const Transaction = ({ order }) => (
  <span>
    <strong>{moment(order.ordered_at).calendar()}</strong>
    <br />
    {order.member.fullname} bought {listOfProducts(order.products)} for{' '}
    <Price
      products={order.products}
      price={order.products
        .map(product => product.price)
        .reduce((sum, price) => sum + price, 0)}
    />
  </span>
);

const Transactions = ({ transactions }) => (
  <ul style={{ columnCount: 2, paddingLeft: 0 }}>
    {transactions.map((transaction, idx) => (
      <li key={idx} style={{ marginLeft: '1em' }}>
        <Transaction {...transaction} />
      </li>
    ))}
  </ul>
);

const TransactionPropType = PropTypes.shape({
  order: PropTypes.shape({
    member: PropTypes.shape({}).isRequired,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired
      })
    ),
    ordered_at: PropTypes.number.isRequired
  }).isRequired
});

Transactions.propTypes = {
  transactions: PropTypes.arrayOf(TransactionPropType.isRequired).isRequired
};

export default Transactions;
