import React, {useRef} from "react";
type Props = {
  timeout?: number;
  onClick: () => void;
  onLongPress: () => void;
};
export const useOnLongPress = ({timeout: delay = 500, onClick, onLongPress}: Props) => {
  const onPressRef = useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => {
    return () => {
      if (onPressRef.current) {
        clearTimeout(onPressRef.current);
      }
    };
  }, [delay]);

  const onDown = () => {
    const long = setTimeout(() => {
      if (onPressRef.current) {
        onLongPress();
      }
      onPressRef.current = undefined;
    }, delay);

    onPressRef.current = long;
  };
  const onUp = () => {
    if (onPressRef.current) {
      clearTimeout(onPressRef.current);
      onClick();
    }
    onPressRef.current = undefined;
  };

  return {
    onMouseDown: onDown,
    onPointerDown: onDown,
    onTouchStart: onDown,

    onMouseUp: onUp,
    onPointerUp: onUp,
    onTouchEnd: onUp,
    onTouchCancel: onUp,
  };
};
