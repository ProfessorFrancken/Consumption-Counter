import { Component } from 'react';

const ScreenSaverTimeout = 30000;

export default class ScreenSaver extends Component {
  state = {
    screenSaver: null
  };

  componentWillMount() {
    this.props.listen(({ pathname }) => {
      if (this.state.screenSaver) {
        clearTimeout(this.state.screenSaver);
      }

      const screenSaver =
        pathname !== '/'
          ? setTimeout(this.props.goHome, ScreenSaverTimeout)
          : null;

      this.setState({ screenSaver });
    });
  }

  render() {
    return null;
  }
}
