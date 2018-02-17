import React from 'react';

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

export default BuyMore
