import { connect } from 'react-redux';
import { addProductToOrder } from '../../actions';
import { productsWithOrderCountSelector } from './../../selectors';
import { buyMore } from '../../actions';
import Products from './Products';

const mapStateToProps = state => ({
  products: productsWithOrderCountSelector(state)
});

const mapDispatchToProps = dispatch => ({
  addProductToOrder: product => dispatch(addProductToOrder(product)),
  toggle: product => dispatch(buyMore(product))
});

export default connect(mapStateToProps, mapDispatchToProps)(Products);
