import React from 'react';
import { connect } from 'react-redux'
import { buyMore, buyAll } from './../../actions'

const BuyMore = ({ buyMore, selectedMultipleProducts, buyAll, toggle }) => (
  <div className="form-check">
    <input
      type="checkbox"
      className="form-check-input"
      id="i-want-more"
      checked={buyMore}
      onChange={toggle}
    />
    <label className="form-check-label" htmlFor="i-want-more">
      I want more
    </label> {selectedMultipleProducts
     ? <button className="btn btn-lg btn-outline-light" onClick={buyAll}>Buy it all!</button> : null}
  </div>
)

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
