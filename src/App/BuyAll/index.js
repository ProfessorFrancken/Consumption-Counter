import React from 'react';
import { connect } from 'react-redux';
import { buyAll } from '../../actions';
import Price from './../Price';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom';

const BuyAll = ({ buyAll, products = [] }) => {
  const location = useLocation();

  if (location.pathname !== '/products') {
    return null;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <button className="button buyAllButton" onClick={buyAll}>
      <FontAwesomeIcon icon={'check-circle'} size="lg" />
      <span style={{ marginLeft: '.5em' }}>
        Buy it all! (<Price products={products} />)
      </span>
    </button>
  );
};

const mapStateToProps = ({ order }) => ({
  products: order.products
});

const mapDispatchToProps = dispatch => ({
  buyAll: () => dispatch(buyAll())
});

export default connect(mapStateToProps, mapDispatchToProps)(BuyAll);
