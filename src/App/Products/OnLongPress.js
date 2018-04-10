import React, { Component } from 'react';
import PropTypes from 'prop-types';

class OnLongPress extends Component {
  state = {
    longPressed: false
  };

  constructor(props) {
    super(props);

    this.start = this.start.bind(this);
    this.end = this.end.bind(this);
    this.onLongPress = this.onLongPress.bind(this);
  }

  start() {
    this.longPressTimeOut = setTimeout(this.onLongPress, this.props.timeout);
  }

  end() {
    if (this.state.longPressed) {
      this.setState({ longPressed: false });
      return;
    }

    this.props.onClick();

    clearTimeout(this.longPressTimeOut);
  }

  onLongPress() {
    this.setState({ longPressed: true });

    this.props.onLongPress();

    clearTimeout(this.longPressTimeOut);
  }

  render() {
    const { children } = this.props;

    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, {
        onMouseDown: this.start,
        onTouchStart: this.start,
        onMouseUp: this.end,
        onTouchCancel: this.end,
        onTouchEnd: this.end
      })
    );

    return childrenWithProps;
  }
}

OnLongPress.propTypes = {
  timeout: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  onLongPress: PropTypes.func.isRequired
};

OnLongPress.defaultProps = {
  timeout: 500
};

export default OnLongPress;
