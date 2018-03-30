import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authenticate } from '../../actions';

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
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Authenticate</h2>
        <label>
          Password
          <input
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Authenticate" />
      </form>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  authenticate: password => dispatch(authenticate(password))
});

export default connect(undefined, mapDispatchToProps)(Authenticate);
