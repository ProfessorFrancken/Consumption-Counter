import React from 'react'
import Transactions from './Transactions'
import { mount } from 'enzyme'

it('shows no transactions', () => {
  const transactions = mount(
    <Transactions transactions={[]} />
  );

  expect(transactions.find('li').length).toEqual(0)
})

it('shows the latest transactions', () => {
  const transactions = mount(
    <Transactions transactions={[
      { member: {}, order: { products: [ { name: 'Hertog Jan', price: 68 }]}}
    ]} />
  );

  expect(transactions.find('li').length).toEqual(1)
})
