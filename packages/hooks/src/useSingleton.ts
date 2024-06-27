import { useRef } from 'react';

/**
 * @description
 * 用于保证一个函数只被调用一次的 hook。
 * 第一次调用时，会执行传入的函数，并将 called 标记为 true；
 * 第二次调用时，直接返回，不再执行传入的函数。
 * @param callback 要执行的函数
 * @returns
 * @example
 * ```tsx
 * const ExampleComponent: React.FC = () => {
 *  useSingleton(() => {
 *    console.log("This will only run once");
 *  });
 *
 *  return <div>Check the console for a message.</div>;
 * };
 * ```
 */
export const useSingleton = (callback: () => void) => {
  const called = useRef(false);

  if (called.current) return;

  callback();

  called.current = true;
};
