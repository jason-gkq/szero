import { useEffect, useRef } from 'react';

export const useInterval = (fn: Function, delay: number, deps: any[] = []) => {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  }, [fn]);
  useEffect(() => {
    function tick() {
      //再用函数包一层是因为函数总是在调用时才执行 这样函数内部引用的ref.current总是最新的
      ref.current();
    }
    const timer = setInterval(tick, delay);
    return () => {
      clearInterval(timer);
    };
  }, [delay, ...deps]);
};
