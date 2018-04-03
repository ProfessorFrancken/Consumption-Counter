import React, { Component } from 'react';

class TempleCountButton extends Component {
  state = { count: null };

  constructor(props) {
    super(props);

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
        error => console.log(error) && this.setState({ count: 0 })
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

  counter() {
    const count = this.state.count;
    return count === null ? null : `(${count})`;
  }

  render() {
    return (
      <button className="tile button" onClick={this.decreaseTempleCount}>
        Decrease<br />Temple Count<br />
        {this.counter()}
      </button>
    );
  }
}

export default TempleCountButton;
