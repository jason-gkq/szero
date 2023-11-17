import { useCallback, useEffect, useRef } from 'react';

export const useDebounce = function (
  fn: Function,
  delay: number,
  deps: any[] = []
) {
  const ref = useRef({ fn, timer: null as NodeJS.Timeout | null });
  useEffect(() => {
    ref.current.fn = fn;
  }, [fn]);
  return useCallback(
    function (this: any, ...args: any) {
      if (ref.current.timer) {
        clearTimeout(ref.current.timer);
      }
      ref.current.timer = setTimeout(() => {
        // 再包一层
        ref.current.fn.call(this, ...args);
      }, delay);
    },
    [delay, ...deps]
  );
};

export const useThrottle = function (
  fn: Function,
  delay: number,
  deps: any[] = []
) {
  const ref = useRef({ fn, time: null as Date | null });
  useEffect(() => {
    ref.current.fn = fn;
  }, [fn]);
  useEffect(() => {
    ref.current.time = null;
  }, [...deps]);
  return useCallback(
    function (this: any, ...args: any) {
      if (ref.current.time) {
        if (new Date().getTime() - ref.current.time.getTime() <= delay) {
          return;
        }
      }
      ref.current.time = new Date();
      ref.current.fn.call(this, ...args);
    },
    [delay, ...deps]
  );
};
