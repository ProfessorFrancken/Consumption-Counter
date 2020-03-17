import { createSelector } from 'reselect';
import { queuedOrderSelector, queuedOrdersSelector } from 'selectors';

export const backgroundSelector = createSelector(queuedOrderSelector, order => {
  if (order === null) {
    return null;
  }

  const product = order.order.products.find(
    product => product.splash_image !== null
  );

  return product === undefined ? null : product.splash_image;
});

export const failedOrdersSelector = createSelector(
  queuedOrdersSelector,
  orders => {
    return orders.filter(order => order.fails > 0).length;
  }
);
