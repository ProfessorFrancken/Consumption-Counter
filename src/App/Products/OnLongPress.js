import React, {Component} from "react";
import PropTypes from "prop-types";

class OnLongPress extends Component {
  state = {
    longPressed: false,
    longPressTimeout: null,
  };

  constructor(props) {
    super(props);

    this.start = this.start.bind(this);
    this.end = this.end.bind(this);
    this.onLongPress = this.onLongPress.bind(this);
  }

  start(e) {
    e.preventDefault();

    const longPressTimeOut = setTimeout(this.onLongPress, this.props.timeout);

    this.setState({longPressTimeOut, longPressed: false});
  }

  end(e) {
    e.preventDefault();

    if (this.state.longPressed) {
      this.setState({longPressed: false, longPressTimeOut: null});
      return;
    }

    clearTimeout(this.state.longPressTimeOut);

    this.props.onClick();
  }

  onLongPress() {
    clearTimeout(this.state.longPressTimeOut);

    this.setState({longPressed: true, longPressTimeOut: null});

    this.props.onLongPress();
  }

  render() {
    const {children} = this.props;

    const childrenWithProps = React.Children.map(children, (child) =>
      React.cloneElement(child, {
        onMouseDown: this.start,
        onTouchStart: this.start,
        onMouseUp: this.end,
        onTouchCancel: this.end,
        onTouchEnd: this.end,
      })
    );

    return childrenWithProps;
  }
}

OnLongPress.propTypes = {
  timeout: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  onLongPress: PropTypes.func.isRequired,
};

OnLongPress.defaultProps = {
  timeout: 500,
};

export default OnLongPress;
