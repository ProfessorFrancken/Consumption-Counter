import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { buyAll } from '../../actions';
import Price from './../Price';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BuyAll = ({ buyAll, products = [], location }) =>
  location.pathname !== '/products' || products.length === 0 ? null : (
    <button className="button buyAllButton" onClick={buyAll}>
      <FontAwesomeIcon icon={'check-circle'} size="lg" />
      <span style={{ marginLeft: '.5em' }}>
        Buy it all! (<Price products={products} />)
      </span>
    </button>
  );

const mapStateToProps = ({ order }) => ({
  products: order.products
});

const mapDispatchToProps = dispatch => ({
  buyAll: () => dispatch(buyAll())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BuyAll));
