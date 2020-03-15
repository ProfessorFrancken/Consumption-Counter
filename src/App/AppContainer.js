import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchInitialData } from './../actions';
import { backgroundSelector, failedOrdersSelector } from './../selectors';
import { withRouter } from 'react-router-dom';
import { push } from 'connected-react-router';
import ScreenSaver from './ScreenSaver';
import App from './App';

class AppContainer extends Component {
  UNSAFE_componentWillMount() {
    this.props.fetchData();
  }

  render() {
    return (
      <>
        <ScreenSaver
          listen={this.props.history.listen}
          goHome={this.props.goHome}
          goToScreenSaver={this.props.goToScreenSaver}
        />
        <App {...this.props} />
      </>
    );
  }
}

const mapStateToProps = state => ({
  menuItems: state.menuItems,
  title: state.title,
  background: backgroundSelector(state),
  failedOrders: failedOrdersSelector(state)
});

const mapDispatchToProps = dispatch => ({
  fetchData: () => dispatch(fetchInitialData()),
  goToCompucieScreen: () => dispatch(push('/compucie')),
  goToProminent: () => dispatch(push('/prominent')),
  goHome: () => dispatch(push('/')),
  goToScreenSaver: () => dispatch(push('/statistics'))
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AppContainer)
);

// TODO add lifecycle stuff so that we can load initial data

/* export connect(mapStateToProps)(AppContainer)*/
