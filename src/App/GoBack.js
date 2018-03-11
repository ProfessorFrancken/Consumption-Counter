import React from 'react';
import { connect } from 'react-redux';
import { goBack } from './../actions';
import { goBackText } from './../selectors';
import { withRouter } from 'react-router-dom';

const GoBack = ({ text, onClick, location }) => {
  if (text === 'Go back' && location.pathname === '/') {
    return null;
  }

  return (
    <div className="Footer-go-back">
      <button
        className="btn btn-outline-light btn-lg btn-block"
        to="/"
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

const mapStateToProps = state => ({
  text: goBackText(state)
});

const mapDispatchToProps = dispatch => ({
  onClick: () => dispatch(goBack())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GoBack));
