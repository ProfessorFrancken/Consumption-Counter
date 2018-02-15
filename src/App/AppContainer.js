import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchInitialData } from './../actions'
import { withRouter } from 'react-router-dom'
import App from './App'

class AppContainer extends Component {
  componentWillMount() {
    this.props.fetchData()
  }

  render() {
    return <App {...this.props} />
  }
}

const mapStateToProps = state => state
const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: () => dispatch(fetchInitialData())
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppContainer))

// TODO add lifecycle stuff so that we can load initial data

/* export connect(mapStateToProps)(AppContainer)*/
