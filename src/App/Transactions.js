import React from 'react'
import { connect } from 'react-redux'

const Price = ({ price }) => (
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(price)
)
const Transaction = ({ member, order }) => (
  <li>
    {member.firstName} {member.surname}
    {' '}
    bought
    {' '}
    {order.products.map((product) => product.name ).join(',')}
    {' '}
    for
    {' '}
    <Price price={
      order.products.map((product) => product.price ).reduce((sum, price) => sum + price, 0)
    }  />
  </li>
)

const Transactions = ({ transactions }) => (
  <ol>
    {transactions.map((transaction) => <Transaction {...transaction} />)}
  </ol>
)

const mapStateToProps = state => {
  return {
    transactions: state.transactions
  }
}

export default connect(mapStateToProps)(Transactions)
