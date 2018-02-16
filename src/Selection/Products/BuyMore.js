import React from 'react';
import { connect } from 'react-redux'
import { buyMore } from './../../actions'

const BuyMore = ({ buyMore, toggle }) => (
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
    </label>
  </div>
)

const mapStateToProps = state => {
  return { buyMore: state.buyMore }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggle: () => dispatch(buyMore())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(BuyMore)
