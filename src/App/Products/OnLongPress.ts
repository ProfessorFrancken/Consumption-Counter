import React, {Component} from "react";
import PropTypes from "prop-types";
class OnLongPress extends Component {
  static propTypes = {
    timeout: PropTypes.number.isRequired,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    onLongPress: PropTypes.func.isRequired,
  };
  static defaultProps = {
    timeout: 500,
  };
  state = {
    longPressed: false,
    longPressTimeout: null,
  };
  constructor(props: any) {
    super(props);
    this.start = this.start.bind(this);
    this.end = this.end.bind(this);
    this.onLongPress = this.onLongPress.bind(this);
    this.onClick = this.onClick.bind(this);
  }
  start(e: any) {
    e.preventDefault();
    const longPressTimeOut = setTimeout(this.onLongPress, (this.props as any).timeout);
    this.setState({longPressTimeOut, longPressed: false});
  }
  end(e: any) {
    e.preventDefault();
    if (this.state.longPressed) {
      this.setState({longPressed: false, longPressTimeOut: null});
      return;
    }
    // @ts-expect-error ts-migrate(2551) FIXME: Property 'longPressTimeOut' does not exist on type... Remove this comment to see the full error message
    clearTimeout(this.state.longPressTimeOut);
    (this.props as any).onClick();
  }
  onLongPress() {
    // @ts-expect-error ts-migrate(2551) FIXME: Property 'longPressTimeOut' does not exist on type... Remove this comment to see the full error message
    clearTimeout(this.state.longPressTimeOut);
    this.setState({longPressed: true, longPressTimeOut: null});
    (this.props as any).onLongPress();
  }
  onClick(e: any) {
    this.start(e);
  }
  render() {
    const {children} = this.props;
    const childrenWithProps = React.Children.map(children, (child) =>
      // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
      React.cloneElement(child, {
        onMouseDown: this.start,
        onTouchStart: this.start,
        onMouseUp: this.end,
        onTouchCancel: this.end,
        onTouchEnd: this.end,
        onClick: this.onClick,
      })
    );
    return childrenWithProps;
  }
}
export default OnLongPress;

/*
import {useCallback, useRef, useState} from "react";

const useLongPress = (
  onLongPress,
  onClick,
  {shouldPreventDefault = true, delay = 300} = {}
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef();
  const target = useRef();

  const start = useCallback(
    (event) => {
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener("touchend", preventDefault, {
          passive: false,
        });
        target.current = event.target;
      }
      timeout.current = setTimeout(() => {
        onLongPress(event);
        setLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault]
  );

  const clear = useCallback(
    (event, shouldTriggerClick = true) => {
      timeout.current && clearTimeout(timeout.current);
      shouldTriggerClick && !longPressTriggered && onClick();
      setLongPressTriggered(false);
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener("touchend", preventDefault);
      }
    },
    [shouldPreventDefault, onClick, longPressTriggered]
  );

  return {
    onMouseDown: (e) => start(e),
    onTouchStart: (e) => start(e),
    onMouseUp: (e) => clear(e),
    onMouseLeave: (e) => clear(e, false),
    onTouchEnd: (e) => clear(e),
  };
};

const isTouchEvent = (event: any) => {
  return "touches" in event;
};

const preventDefault = (event: any) => {
  if (!isTouchEvent(event)) return;

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
  }
};
 * */
