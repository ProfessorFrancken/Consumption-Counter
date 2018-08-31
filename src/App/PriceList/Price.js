import React from 'react';
import PropTypes from 'prop-types';

const Price = ({ price }) => (
  <span>
    {new Intl.NumberFormat('en-EN', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)}
  </span>
);

Price.propTypes = {
  price: PropTypes.number.isRequired
};

export default Price;
