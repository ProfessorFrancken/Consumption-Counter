import React from 'react';
import Product from './Product';
import { connect } from 'react-redux';
import { buyMore } from '../../actions';

const mapStateToProps = ({ order }) => ({
  buyMore: order.buyMore
});

const mapDispatchToProps = dispatch => ({
  toggle: product => dispatch(buyMore(product))
});

export default connect(mapStateToProps, mapDispatchToProps)(Product);
