import { useEffect } from 'react';

/**
 * Small utility to create a timer with the recursive setTimeout method.
 * In contrast of useInterval, this will not queue executions based on only time
 * but it will also wait for the callback execution to complete to start counting.
 * This is usefull for polling, where you don't want to keep stacking requests
 * while the previous is still executing.
 *
 * Timer should automatically stop after unmounting this hook. Caller can stop it by
 * setting delay as null.
 *
 * @param {*} callback useCallback handler function to execute per tick.
 * @param {*} delay How long it should wait in between one completed execution an another,
 *                  null will disable the timer.
 */
const useTimer = (callback, delay = null) => {
  useEffect(() => {
    let id;
    const tick = () => {
      if (!delay) {
        return;
      }

      const ret = callback();
      if (ret instanceof Promise) {
        ret.then(() => {
          if (!delay) {
            return;
          }

          id = setTimeout(tick, delay);
        });
      } else {
        if (!delay) {
          return;
        }

        id = setTimeout(tick, delay);
      }
    };
    id = setTimeout(tick, delay);

    return () => id && clearTimeout(id);
  }, [delay, callback]);
};

export default useTimer;
