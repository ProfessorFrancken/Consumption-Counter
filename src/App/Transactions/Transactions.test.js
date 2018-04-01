import React from 'react';
import Transactions from './Transactions';
import { mount } from 'enzyme';

it('shows no transactions', () => {
  const transactions = mount(<Transactions transactions={[]} />);

  expect(transactions.find('li').length).toEqual(0);
});

it('shows the latest transactions', () => {
  const transactions = mount(
    <Transactions
      transactions={[
        {
          order: {
            member: { firstName: 'Mark' },
            products: [{ name: 'Hertog Jan', price: 68 }],
            ordered_at: 1
          }
        }
      ]}
    />
  );

  expect(transactions.find('li').length).toEqual(1);
});
