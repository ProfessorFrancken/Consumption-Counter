import React from 'react';

const RetryAll = ({ orders, buy }) => (
  <button
    className="btn btn-success"
    onClick={() => orders.forEach(order => buy(order.order))}
  >
    Retry all
  </button>
);

export default RetryAll;
