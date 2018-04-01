import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authenticate } from '../../../actions';
import AuthenticationForm from './AuthenticationForm';

class Authenticate extends Component {
  constructor(props) {
    super(props);
    this.state = { password: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    this.props.authenticate(this.state.password);
    event.preventDefault();
  }

  render() {
    const { request, token, error } = this.props.authentication;

    return (
      <AuthenticationForm
        changePassword={this.handleChange}
        submit={this.handleSubmit}
        password={this.state.password}
        token={token}
        request={request}
        error={error}
      />
    );
  }
}

const mapStateToProps = state => ({
  authentication: state.authentication
});

const mapDispatchToProps = dispatch => ({
  authenticate: password => dispatch(authenticate(password))
});

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);
