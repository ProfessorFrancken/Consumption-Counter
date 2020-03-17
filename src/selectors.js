import { createSelector } from 'reselect';
import { mapValues } from 'lodash';
export { loadingScreenSelector } from 'Loading/selector';
export {
  committeesSelector,
  committeesWithMembersSelector,
  membersInCommitteesSelector,
  compucieSelector
} from 'App/Committees/selectors';
export { boardsSelector, prominentSelector } from 'App/Prominent/selectors';
export { goBackText } from 'Layout/Buttons/GoBack/selectors';

export const membersSelector = state => state.members;
const categorySelector = state => state.products;
export const orderSelector = state => state.order;

export const rangesSelector = state => state.surnameRanges.ranges;
export const queuedOrderSelector = state => state.queuedOrder;
export const queuedOrdersSelector = state => state.queuedOrders;
export const membersInRangeSelector = (state, { page = 0 }) =>
  state.surnameRanges.ranges[page].members;

// Select products that the selected member is allowed to buy
const allowedProductsSelector = createSelector(
  categorySelector,
  orderSelector,
  (categories, order) =>
    mapValues(categories, products =>
      products.filter(product => product.age_restriction <= order.member.age)
    )
);

export const backgroundSelector = createSelector(queuedOrderSelector, order => {
  if (order === null) {
    return null;
  }

  const product = order.order.products.find(
    product => product.splash_image !== null
  );

  return product === undefined ? null : product.splash_image;
});

const isProductLocked = (product, hour) => {
  if (product.category === 'Bier') {
    if (['Almanak', 'Almanac'].includes(product.name)) {
      return false;
    }

    return [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].includes(hour);
  }

  if (product.name === 'Goede morgen!') {
    return ![6, 7, 8, 9, 10, 11].includes(hour);
  }

  return false;
};

const hourSelector = (state, { hour }) => hour;

export const productsWithOrderCountSelector = createSelector(
  allowedProductsSelector,
  orderSelector,
  hourSelector,
  (categories, order, hour) =>
    mapValues(
      categories,
      // For each product in the category, count the mount of times it was ordered
      products =>
        products.map(product => ({
          ...product,
          locked: isProductLocked(product, hour),
          ordered: order.products.filter(p => p.id === product.id).length
        }))
    )
);

export const failedOrdersSelector = createSelector(
  queuedOrdersSelector,
  orders => {
    return orders.filter(order => order.fails > 0).length;
  }
);
