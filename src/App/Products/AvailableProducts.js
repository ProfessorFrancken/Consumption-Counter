import { connect } from 'react-redux';
import { mapValues } from 'lodash';
import { addProductToOrder } from '../../actions';
import Products from './Products';

const getAvailableProducts = (products, order) =>
  mapValues(products, products =>
    products
      .filter(product => product.age_restriction <= order.member.age)
      .map(product => {
        return {
          ...product,
          ordered: order.products.filter(p => p.id === product.id).length
        };
      })
  );

const mapStateToProps = state => {
  return {
    products: getAvailableProducts(state.products, state.order)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addProductToOrder: product => {
      dispatch(addProductToOrder(product));
    }
  };
};

const AvailableProducts = connect(mapStateToProps, mapDispatchToProps)(
  Products
);

export default AvailableProducts;
