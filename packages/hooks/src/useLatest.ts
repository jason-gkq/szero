/**
 * @description 确保获取最新值，且可以解决闭包问题
 */
import { useRef } from 'react';

const useLatest = <T>(value: T) => {
  const ref = useRef(value);
  ref.current = value;

  return ref;
};
export default useLatest;
