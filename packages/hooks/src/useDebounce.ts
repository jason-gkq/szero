import { useCallback, useEffect, useRef } from 'react';

type CallbackFunction = (...args: any[]) => void;

/**
 * @description 防抖
 * useDebounce hook
 * @param fn callback function
 * @param delay delay time in milliseconds
 * @param deps dependencies
 * @returns debounced function
 * @example
 * ```tsx
 * // Usage example
 * const ExampleComponent: React.FC = () => {
 *  const [value, setValue] = useState('');
 *  const debouncedLog = useDebounce((input: string) => {
 *    console.log(input);
 *  }, 500, [value]);
 *
 *  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
 *    setValue(event.target.value);
 *    debouncedLog(event.target.value);
 *  };
 *
 *  return (
 *    <div>
 *      <input type="text" value={value} onChange={handleChange} />
 *    </div>
 *  );
 * };
 * ```
 */
export const useDebounce = function (
  fn: CallbackFunction,
  delay: number,
  deps: React.DependencyList = []
) {
  const ref = useRef<{ fn: CallbackFunction; timer: NodeJS.Timeout | null }>({
    fn,
    timer: null,
  });

  useEffect(() => {
    ref.current.fn = fn;
  }, [fn]);

  return useCallback(
    function (this: unknown, ...args: unknown[]) {
      if (ref.current.timer) {
        clearTimeout(ref.current.timer);
      }
      ref.current.timer = setTimeout(() => {
        // 再包一层
        ref.current.fn.apply(this, args);
      }, delay);
    },
    [delay, ...deps]
  );
};
