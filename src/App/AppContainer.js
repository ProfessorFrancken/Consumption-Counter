import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { fetchInitialData } from './../actions';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import App from './App';

class AppContainer extends Component {
  componentWillMount() {
    this.props.fetchData();
  }

  render() {
    return <App {...this.props} />;
  }
}

const orderSelector = state => state.queuedOrder;
const backgroundSelector = createSelector(orderSelector, order => {
  if (order === null) {
    return null;
  }

  const product = order.order.products.find(
    product => product.splash_image !== null
  );

  return product === undefined ? null : product.splash_image;
});

const mapStateToProps = state => ({
  title: state.title,
  background: backgroundSelector(state)
});

const mapDispatchToProps = dispatch => ({
  fetchData: () => dispatch(fetchInitialData()),
  goToCompucieScreen: () => dispatch(push('/compucie'))
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AppContainer)
);

// TODO add lifecycle stuff so that we can load initial data

/* export connect(mapStateToProps)(AppContainer)*/
