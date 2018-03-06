import React from 'react';
import { connect } from 'react-redux';
import { goBack } from './../actions';
import Icon from './Icon';

const GoBack = ({ onClick }) => (
  <div className="button backButton" onClick={onClick}>
    <Icon name="arrow-circle-left" />
  </div>
);

const mapDispatchToProps = dispatch => {
  return {
    onClick: () => dispatch(goBack())
  };
};

export default connect(undefined, mapDispatchToProps)(GoBack);
