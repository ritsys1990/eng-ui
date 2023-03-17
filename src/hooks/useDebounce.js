import { useState, useEffect } from 'react';

/**
 * Hook to get debounced value
 * @function
 * @param {any} value - Value that you want to debounce
 * @param {number} delay - Timer in miliseconds to debounce
 * @returns {any}
 */
function useDebounce(value, delay = 1000) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
