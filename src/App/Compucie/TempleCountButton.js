import React, { Component } from 'react';

class TempleCountButton extends Component {
  constructor(props) {
    super(props);

    this.state = { count: null };

    this.fetchTempleCount = this.fetchTempleCount.bind(this);
    this.decreaseTempleCount = this.decreaseTempleCount.bind(this);
  }

  componentWillMount() {
    this.fetchTempleCount();
  }

  fetchTempleCount() {
    fetch(`https://borrelcie.vodka/chwazorcle/hoeveel.php`)
      .then(this.handleResponse)
      .then(
        count => this.setState({ count }),
        error => this.setState({ count: 0 })
      );
  }

  handleResponse(response) {
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }

    return response.json();
  }

  decreaseTempleCount() {
    this.props.decreaseTempleCount();

    this.setState(({ count }) => ({ count: count - 1 }));
  }

  render() {
    return (
      <button className="tile button" onClick={this.decreaseTempleCount}>
        Decrease<br />Temple Count<br />
        {this.state.count ? `(${this.state.count})` : null}
      </button>
    );
  }
}

export default TempleCountButton;
