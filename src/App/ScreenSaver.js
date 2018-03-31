import { Component } from 'react';

const ScreenSaverTimeout = 30000;

export default class ScreenSaver extends Component {
  state = {
    screenSaver: null
  };

  constructor(props) {
    super(props);
    this.screenSaver = this.screenSaver.bind(this);
  }

  componentWillMount() {
    this.unlisten = this.props.listen(this.screenSaver);
  }

  componentWillUnmount() {
    this.unlisten();

    if (this.state.screenSaver) {
      clearTimeout(this.state.screenSaver);
    }
  }

  screenSaver({ pathname }) {
    if (this.state.screenSaver) {
      clearTimeout(this.state.screenSaver);
    }

    const screenSaver =
      pathname !== '/'
        ? setTimeout(this.props.goHome, ScreenSaverTimeout)
        : null;

    this.setState({ screenSaver });
  }

  render() {
    return null;
  }
}
