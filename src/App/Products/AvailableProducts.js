import { connect } from 'react-redux';
import { addProductToOrder } from '../../actions';
import { productsWithOrderCountSelector } from './../../selectors';
import Products from './Products';

const mapStateToProps = state => ({
  products: productsWithOrderCountSelector(state)
});

const mapDispatchToProps = dispatch => ({
  addProductToOrder: product => dispatch(addProductToOrder(product))
});

export default connect(mapStateToProps, mapDispatchToProps)(Products);
