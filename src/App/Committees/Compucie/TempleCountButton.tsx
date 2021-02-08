import React, {Component} from "react";
import axios from "axios";

type State = any;
class TempleCountButton extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {count: null};
    this.fetchTempleCount = this.fetchTempleCount.bind(this);
    this.decreaseTempleCount = this.decreaseTempleCount.bind(this);
  }
  UNSAFE_componentWillMount() {
    this.fetchTempleCount();
  }
  fetchTempleCount() {
    axios
      .get(`https://borrelcie.vodka/chwazorcle/hoeveel.php`)

      .then(this.handleResponse)
      .then(
        (count) => {
          return this.setState({count});
        },
        (error) => this.setState({count: 0})
      );
  }
  handleResponse(response: any) {
    if (!response.data) {
      return Promise.reject(response.statusText);
    }
    return response.data;
  }
  decreaseTempleCount() {
    (this.props as any).decreaseTempleCount();
    this.setState(({count}: any) => ({count: count - 1}));
  }
  render() {
    return (
      <button className="tile button" onClick={this.decreaseTempleCount}>
        Decrease
        <br />
        Temple Count
        <br />
        {this.state.count ? ` (${this.state.count})` : null}
      </button>
    );
  }
}
export default TempleCountButton;
