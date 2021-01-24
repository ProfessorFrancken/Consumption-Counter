import {createSelector} from "reselect";
import {mapValues} from "lodash";
import {orderSelector} from "selectors";

const categorySelector = (state: any) => state.products;
const hourSelector = (state: any, {hour}: any) => hour;

// Select products that the selected member is allowed to buy
const allowedProductsSelector = createSelector(
  categorySelector,
  orderSelector,
  (categories, order) =>
    mapValues(categories, (products: any) =>
      products.filter((product: any) => product.age_restriction <= order.member.age)
    )
);

const isProductLocked = (product: any, hour: any) => {
  if (product.category === "Bier") {
    if (["Almanak", "Almanac"].includes(product.name)) {
      return false;
    }

    return [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].includes(hour);
  }

  if (product.name === "Goede morgen!") {
    return ![6, 7, 8, 9, 10, 11].includes(hour);
  }

  return false;
};

export const productsWithOrderCountSelector = createSelector(
  allowedProductsSelector,
  orderSelector,
  hourSelector,
  (categories, order, hour) =>
    mapValues(
      categories,
      // For each product in the category, count the mount of times it was ordered
      (products: any) =>
        products.map((product: any) => ({
          ...product,
          locked: isProductLocked(product, hour),
          ordered: order.products.filter((p: any) => p.id === product.id).length,
        }))
    )
);
