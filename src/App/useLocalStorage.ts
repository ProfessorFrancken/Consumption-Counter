import React from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
  const readValue = () => {
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key);

        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.warn(`Error reading localStorage key “${key}”:`, error);
      }
    }

    return initialValue;
  };

  const [storedValue, setStoredValue] = React.useState<T>(readValue);

  React.useEffect(() => {
    if (typeof window == "undefined") {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      );
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  }, [storedValue, key]);

  return [storedValue, setStoredValue] as const;
}
export default useLocalStorage;
