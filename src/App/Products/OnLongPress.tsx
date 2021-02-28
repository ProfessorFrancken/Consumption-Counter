import React from "react";

const OnLongPress: React.FC<{
  timeout?: number;
  onClick: () => void;
  onLongPress: () => void;
}> = ({timeout: delay = 500, onClick, onLongPress, children}) => {
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

  const childrenWithProps = React.Children.map<React.ReactNode, React.ReactNode>(
    children,
    (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          onMouseDown: onDown,
          onTouchStart: onDown,
          onMouseUp: onUp,
          onTouchCancel: onUp,
          onTouchEnd: onUp,
        });
      }
      return child;
    }
  );
  return <>{childrenWithProps}</>;
};

export default OnLongPress;
