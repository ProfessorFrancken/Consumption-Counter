import BuyMore from './BuyMore'
import { connect } from 'react-redux'
import { buyMore, buyAll } from './../../actions'

const mapStateToProps = state => {
  return {
    buyMore: state.buyMore,
    selectedMultipleProducts: state.buyMore && state.order.products.length > 0
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggle: () => dispatch(buyMore()),
    buyAll: () => dispatch(buyAll())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(BuyMore)
