import React from 'react'
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

export default Transactions
