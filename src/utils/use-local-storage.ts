import React from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
  const readValue = () => {
    try {
      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
    }

    return initialValue;
  };

  const [storedValue, setStoredValue] = React.useState<T>(readValue);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  }, [storedValue, key]);

  return [storedValue, setStoredValue] as const;
}
export default useLocalStorage;
