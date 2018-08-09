import React from 'react';
import { connect } from 'react-redux';
import { goBack } from './../actions';
import { goBackText } from './../selectors';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const GoBack = ({ text, location, onClick }) => {
  if (text === 'Go back' && location.pathname === '/') {
    return null;
  }

  return (
    <button className="button backButton" onClick={onClick}>
      <FontAwesomeIcon icon={'arrow-circle-left'} size="lg" />
      <span style={{ marginLeft: '.5em' }}>{text}</span>
    </button>
  );
};

const mapStateToProps = state => ({
  text: goBackText(state)
});

const mapDispatchToProps = dispatch => {
  return {
    onClick: () => dispatch(goBack())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GoBack));
