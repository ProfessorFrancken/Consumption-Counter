import React from 'react';
import { connect } from 'react-redux';
import { buyAll } from '../../actions';
import Icon from './../Icon';

const BuyAll = ({ buyAll, buyMore }) =>
  !buyMore ? null : (
    <button className="button buyAllButton" onClick={buyAll}>
      <Icon name="check-circle" />
      <span style={{ marginLeft: '.5em' }}>Buy it all!</span>
    </button>
  );

const mapStateToProps = ({ order }) => ({
  buyMore: order.buyMore
});

const mapDispatchToProps = dispatch => ({
  buyAll: () => dispatch(buyAll())
});

export default connect(mapStateToProps, mapDispatchToProps)(BuyAll);
