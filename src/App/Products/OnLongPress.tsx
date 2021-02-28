import React from "react";
type Props = {
  timeout?: number;
  onClick: () => void;
  onLongPress: () => void;
};
export const useOnLongPress = ({timeout: delay = 500, onClick, onLongPress}: Props) => {
  const [triggered, setTriggered] = React.useState(false);
  React.useEffect(() => {
    if (!triggered) {
      return;
    }

    const long = setTimeout(() => {
      onLongPress();
      setTriggered(false);
    }, delay);

    return () => {
      clearTimeout(long);
    };
  }, [triggered, onLongPress, setTriggered, delay]);

  const onDown = () => {
    setTriggered(true);
  };
  const onUp = () => {
    if (triggered) {
      onClick();
    }
    setTriggered(false);
  };

  return {
    onMouseDown: onDown,
    onTouchStart: onDown,
    onMouseUp: onUp,
    onTouchCancel: onUp,
    onTouchEnd: onUp,
  };
};
