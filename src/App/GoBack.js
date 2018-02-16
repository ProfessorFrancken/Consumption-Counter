import React from 'react'
import { connect } from 'react-redux'
import { goBack } from './../actions'

const GoBack = ({ onClick }) => (
  <div className="Footer-go-back">
    <button className="btn btn-outline-light btn-lg btn-block" to="/" onClick={onClick}>
      Go back
    </button>
  </div>
)

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: () => dispatch(goBack())
  }
};

export default connect(undefined, mapDispatchToProps)(GoBack)
