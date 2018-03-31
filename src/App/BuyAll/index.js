import React from 'react';
import { connect } from 'react-redux';
import { buyAll } from '../../actions';
import Price from './../Transactions/Price';
import Icon from './../Icon';

const BuyAll = ({ buyAll, products = [] }) =>
  products.length === 0 ? null : (
    <button className="button buyAllButton" onClick={buyAll}>
      <Icon name="check-circle" />
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

export default connect(mapStateToProps, mapDispatchToProps)(BuyAll);
