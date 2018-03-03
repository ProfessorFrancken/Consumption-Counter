import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchInitialData } from './../actions';
import { withRouter } from 'react-router-dom';
import App from './App';

class AppContainer extends Component {
  componentWillMount() {
    this.props.fetchData();
  }

  render() {
    return <App {...this.props} />;
  }
}

const backgroundFromOrder = order => {
  if (order === null) {
    return null;
  }
  const product = order.order.products.find(
    product => product.splash_image !== null
  );

  return product === undefined ? null : product.splash_image;
};

const mapStateToProps = state => {
  return {
    title: state.title,
    background: backgroundFromOrder(state.queuedOrder)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    fetchData: () => dispatch(fetchInitialData())
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AppContainer)
);

// TODO add lifecycle stuff so that we can load initial data

/* export connect(mapStateToProps)(AppContainer)*/
