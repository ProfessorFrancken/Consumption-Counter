import React from 'react'
import PropTypes from 'prop-types'
import Price from './Price'

const Transaction = ({ member, order }) => (
  <span>
    {member.firstName} {member.surname}
    {' '}
    bought
    {' '}
    {order.products.map((product) => product.name ).join(',')}
    {' '}
    for
    {' '}
    <Price products={order.products} price={
      order.products.map((product) => product.price ).reduce((sum, price) => sum + price, 0)
    }  />
  </span>
)

const Transactions = ({ transactions }) => (
  <ol>
    {transactions.map((transaction, idx) =>
      <li key={idx}>
        <Transaction {...transaction}/>
      </li>
    )}
  </ol>
)

const TransactionPropType = PropTypes.shape({
  member: PropTypes.shape({}).isRequired,
  order: PropTypes.shape({
    products: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
      })
    )
  }).isRequired,
});

Transactions.propTypes = {
  transactions: PropTypes.arrayOf(
    TransactionPropType.isRequired
  ).isRequired,
}

export default Transactions
