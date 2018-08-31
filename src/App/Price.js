import React from 'react';

const totalPrice = products =>
  products.map(product => product.price).reduce((sum, price) => sum + price, 0);

const Price = ({ products }) => (
  <span>
    {new Intl.NumberFormat('en-EN', {
      style: 'currency',
      currency: 'EUR'
    }).format(totalPrice(products))}
  </span>
);

export default Price;
