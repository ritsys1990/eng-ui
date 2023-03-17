import { useEffect, useRef } from 'react';
import env from 'env';

/**
 * Triggers the callback when there haven't been any changes in the values for the dependencies in the interval of time
 * @param callback Function to be invoked
 * @param dependencies Values that are being monitored
 * @param interval Time in ms that you want to wait before invoking the callback after there have been no changes to the depencies values
 */
const useAutoSave = (callback, dependencies, interval = 2000) => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    let handler = null;

    // Making sure we don't trigger the callback on mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      // Update debounced value after delay
      handler = setTimeout(() => {
        if (env.AUTOSAVE_ACTIVE && callback) {
          callback(...dependencies);
        }
      }, interval);
    }

    // Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [interval, ...dependencies]);
};

export default useAutoSave;
