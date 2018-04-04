import React from 'react';
import { connect } from 'react-redux';
import { cancelOrder } from './../../actions';
import { queuedOrderSelector } from './../../selectors';
import Icon from './../Icon';
import Price from './../Transactions/Price';

const products = order =>
  order.products.length === 1 ? order.products[0].name : 'multiple products';

const CancelOrder = ({ onClick, queuedOrder }) =>
  queuedOrder === null ? null : (
    <button
      className="button cancelButton"
      onClick={() => onClick(queuedOrder)}
    >
      <Icon name="times-circle" />
      <span style={{ marginLeft: '.5em' }}>
        Cancel buying {products(queuedOrder.order)} for{' '}
        <Price products={queuedOrder.order.products} />
      </span>
    </button>
  );

const mapDispatchToProps = dispatch => ({
  onClick: order => dispatch(cancelOrder(order.order))
});

const mapStateToProps = state => ({
  queuedOrder: queuedOrderSelector(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(CancelOrder);
