import {LocationListener, UnregisterCallback} from "history";
import {Component} from "react";

type LocationListenerType = (listener: LocationListener) => UnregisterCallback;

export const SCREEN_SAVER_TIMEOUT = 30000;
export default class ScreenSaver extends Component {
  unlisten: any;
  state = {
    screenSaver: null,
  };
  constructor(props: {
    listen: LocationListenerType;
    goHome: () => void;
    goToScreenSave: () => void;
  }) {
    super(props);
    this.screenSaver = this.screenSaver.bind(this);
  }
  UNSAFE_componentWillMount() {
    this.unlisten = (this.props as any).listen(this.screenSaver);
  }
  componentWillUnmount() {
    this.unlisten();
    if (this.state.screenSaver) {
      // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
      clearTimeout(this.state.screenSaver);
    }
  }
  screenSaver({pathname}: any) {
    if (this.state.screenSaver) {
      // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
      clearTimeout(this.state.screenSaver);
    }
    let screenSaver;
    if (pathname === "/") {
      screenSaver = setTimeout(
        (this.props as any).goToScreenSaver,
        2 * SCREEN_SAVER_TIMEOUT
      );
    } else {
      if (pathname !== "/statistics") {
        screenSaver = setTimeout((this.props as any).goHome, SCREEN_SAVER_TIMEOUT);
      }
    }
    this.setState({screenSaver});
  }
  render() {
    return null;
  }
}
