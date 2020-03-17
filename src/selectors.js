import { createSelector } from 'reselect';
export { loadingScreenSelector } from 'Loading/selector';
export {
  committeesSelector,
  committeesWithMembersSelector,
  membersInCommitteesSelector,
  compucieSelector
} from 'App/Committees/selectors';
export { boardsSelector, prominentSelector } from 'App/Prominent/selectors';
export { goBackText } from 'Layout/Buttons/GoBack/selectors';
export { productsWithOrderCountSelector } from 'App/Products/selectors';

export const membersSelector = state => state.members;
export const orderSelector = state => state.order;

export const rangesSelector = state => state.surnameRanges.ranges;
export const queuedOrderSelector = state => state.queuedOrder;
export const queuedOrdersSelector = state => state.queuedOrders;
export const membersInRangeSelector = (state, { page = 0 }) =>
  state.surnameRanges.ranges[page].members;

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
