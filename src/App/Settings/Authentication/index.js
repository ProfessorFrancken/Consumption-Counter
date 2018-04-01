import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authenticate } from '../../../actions';
import Icon from './../../Icon';
import decode from 'jwt-decode';
import moment from 'moment';

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

  authenticated(token) {
    const decoded = decode(token);
    const expiration = new Date(decoded.exp * 1000);

    return (
      <span>
        The system is authentiated until {moment(expiration).calendar()}. You
        can refresh the token by reauthenticating the system.
      </span>
    );
  }

  unauthenticated() {
    return (
      <span>
        You need to authenticate with our server in order to connect the Plus
        One system.
      </span>
    );
  }

  invalidFeedback(error) {
    return error === 'Unauthorized'
      ? 'The given password was incorrect'
      : 'There probably was an unexpected error on the server, call the compucie to solve this.';
  }

  render() {
    const { request, token, error } = this.props.authentication;

    return (
      <div className="mb-5 p-3 bg-light">
        <h2 className="h4 font-weight-normal">
          {token ? null : <Icon name="exclamation-triangle mr-1" />}{' '}
          Authenticate Plus One
        </h2>
        <p className="lead">
          {token ? this.authenticated(token) : this.unauthenticated()}
          <br />
          If you don't know the passphrase you should shout "Compucie!" or
          something similar.
        </p>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="form-group col-lg-5 col-md-8 col-sm-10 col-12">
              <input
                type="password"
                value={this.state.password}
                onChange={this.handleChange}
                className={error ? 'form-control is-invalid' : 'form-control'}
                placeholder="Passphrase"
              />
              {error ? (
                <p className="invalid-feedback">
                  {this.invalidFeedback(error)}
                </p>
              ) : null}
            </div>
          </div>
          <input
            type="submit"
            value={
              request ? 'Waiting' : token ? 'Refresh token' : 'Authenticate'
            }
            className="btn btn-secondary mb-2"
          />
        </form>
      </div>
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
