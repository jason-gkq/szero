import { useRef, useEffect, useCallback } from 'react';

type CallbackFunction = (...args: any[]) => void;

/**
 * @description useThrottle hook 节流
 * @param fn 回调函数
 * @param delay 延迟时间
 * @param deps 依赖
 * @returns 回调函数
 * @example
 * ```tsx
 * const ExampleComponent: React.FC = () => {
 *  const [value, setValue] = useState('');
 *  const throttledLog = useThrottle((input: string) => {
 *    console.log(input);
 *  }, 500, [value]);
 *
 *  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
 *    setValue(event.target.value);
 *    throttledLog(event.target.value);
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
export const useThrottle = (
  fn: CallbackFunction,
  delay: number,
  deps: React.DependencyList = []
) => {
  const ref = useRef<{ fn: CallbackFunction; time: Date | null }>({
    fn,
    time: null,
  });

  useEffect(() => {
    ref.current.fn = fn;
  }, [fn]);

  useEffect(() => {
    ref.current.time = null;
  }, deps);

  return useCallback(
    function (this: unknown, ...args: unknown[]) {
      if (ref.current.time) {
        if (new Date().getTime() - ref.current.time.getTime() <= delay) {
          return;
        }
      }
      ref.current.time = new Date();
      ref.current.fn.apply(this, args);
    },
    [delay, ...deps]
  );
};
