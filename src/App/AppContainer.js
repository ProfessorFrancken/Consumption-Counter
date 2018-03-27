import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchInitialData } from './../actions';
import { backgroundSelector } from './../selectors';
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

const mapStateToProps = state => ({
  title: state.title,
  background: backgroundSelector(state)
});

const mapDispatchToProps = dispatch => ({
  fetchData: () => dispatch(fetchInitialData()),
  goToCompucieScreen: () => dispatch(push('/compucie')),
  goHome: () => dispatch(push('/'))
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AppContainer)
);

// TODO add lifecycle stuff so that we can load initial data

/* export connect(mapStateToProps)(AppContainer)*/
