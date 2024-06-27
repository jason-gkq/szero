import { useEffect, useRef } from 'react';

/**
 * Custom hook for setting up an interval
 * @param fn 函数，将在每个间隔时间内被调用
 * @param delay 它是一个数字，每个间隔的时间间隔，单位是毫秒
 * @param deps 这是一个依赖数组，类型是 React.DependencyList，它实际上等同于 any[]（任何类型的数组），但明确表示它是一个依赖项列表。这个数组列出了该计时器所依赖的变量或值。如果任何依赖项发生变化，计时器将被重置（清除并重新启动）
 *
 * @example
 * ```tsx
 * const ExampleComponent: React.FC = () => {
 *   const [count, setCount] = useState(0);
 *
 *   // Increment the count every second
 *   useInterval(() => {
 *     setCount(prevCount => prevCount + 1);
 *   }, 1000);
 *
 *   return <div>Count: {count}</div>;
 * };
 * ```
 */
export const useInterval = (
  fn: () => void,
  delay: number,
  deps: React.DependencyList = []
) => {
  // Use a ref to store the function, ensuring it's always up-to-date
  const ref = useRef<() => void>(fn);

  useEffect(() => {
    ref.current = fn;
  }, [fn]);
  useEffect(() => {
    function tick() {
      // Call the current function from the ref
      // 再用函数包一层是因为函数总是在调用时才执行 这样函数内部引用的ref.current总是最新的
      ref.current();
    }

    // Start the interval timer
    const timer = setInterval(tick, delay);

    // Clean up the interval timer on unmount or when delay/deps change
    return () => {
      clearInterval(timer);
    };
  }, [delay, ...deps]);
};
