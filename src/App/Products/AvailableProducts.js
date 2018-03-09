import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { mapValues } from 'lodash';
import { addProductToOrder } from '../../actions';
import Products from './Products';

const categorySelector = state => state.products;
const orderSelector = state => state.order;

// Select products that the selected member is allowed to buy
const allowedProductsSelector = createSelector(
  categorySelector,
  orderSelector,
  (categories, order) =>
    mapValues(categories, products =>
      products.filter(product => product.age_restriction <= order.member.age)
    )
);

const productsWithOrderCountSelector = createSelector(
  allowedProductsSelector,
  orderSelector,
  (categories, order) =>
    mapValues(
      categories,
      // For each product in the category, count the mount of times it was ordered
      products =>
        products.map(product => ({
          ...product,
          ordered: order.products.filter(p => p.id === product.id).length
        }))
    )
);

const mapStateToProps = state => ({
  products: productsWithOrderCountSelector(state)
});

const mapDispatchToProps = dispatch => ({
  addProductToOrder: product => dispatch(addProductToOrder(product))
});

const AvailableProducts = connect(mapStateToProps, mapDispatchToProps)(
  Products
);

export default AvailableProducts;
