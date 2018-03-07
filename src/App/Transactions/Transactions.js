import React from 'react';
import PropTypes from 'prop-types';
import Price from './Price';
import { groupBy, map } from 'lodash';

// Show all products that were bought and the amount of times they were bought
const listOfProducts = products =>
  map(
    groupBy(products, product => product.id),
    product =>
      product.length === 1
        ? `${product[0].name}`
        : `${product[0].name} (${product.length}x)`
  ).join(', ');

const Transaction = ({ member, order }) => (
  <span>
    {member.firstName} {member.surname} bought {listOfProducts(order.products)}{' '}
    for{' '}
    <Price
      products={order.products}
      price={order.products
        .map(product => product.price)
        .reduce((sum, price) => sum + price, 0)}
    />
  </span>
);

const Transactions = ({ transactions }) => (
  <ol>
    {transactions.map((transaction, idx) => (
      <li key={idx}>
        <Transaction {...transaction} />
      </li>
    ))}
  </ol>
);

const TransactionPropType = PropTypes.shape({
  member: PropTypes.shape({}).isRequired,
  order: PropTypes.shape({
    products: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired
      })
    )
  }).isRequired
});

Transactions.propTypes = {
  transactions: PropTypes.arrayOf(TransactionPropType.isRequired).isRequired
};

export default Transactions;
