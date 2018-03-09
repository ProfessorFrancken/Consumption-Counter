import BuyMore from './BuyMore';
import { connect } from 'react-redux';
import { buyMore, buyAll } from './../../actions';

const mapStateToProps = ({ order }) => ({
  buyMore: order.buyMore,
  selectedMultipleProducts: order.buyMore && order.products.length > 0
});

const mapDispatchToProps = dispatch => ({
  toggle: () => dispatch(buyMore()),
  buyAll: () => dispatch(buyAll())
});

export default connect(mapStateToProps, mapDispatchToProps)(BuyMore);
