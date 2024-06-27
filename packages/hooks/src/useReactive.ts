import { useRef } from 'react';
import useCreation from './useCreation';
import useUpdate from './useUpdate';

const observer = <T extends Record<string, any>>(
  initialVal: T,
  cb: () => void
): T => {
  const proxy = new Proxy<T>(initialVal, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);
      return typeof res === 'object'
        ? observer(res, cb)
        : Reflect.get(target, key);
    },
    set(target, key, val) {
      const ret = Reflect.set(target, key, val);
      cb();
      return ret;
    },
  });

  return proxy;
};
/**
 * @description 一种具备响应式的useState
 * @example
 * ```tsx
 * const state = useReactive({ count: 0 });
 * ```
 */
const useReactive = <T extends Record<string, any>>(initialState: T): T => {
  const ref = useRef<T>(initialState);
  const update = useUpdate();

  const state = useCreation(() => {
    return observer(ref.current, () => {
      update();
    });
  }, []);

  return state;
};

export default useReactive;
