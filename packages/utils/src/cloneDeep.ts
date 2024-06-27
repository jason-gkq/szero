import isObject from './isObject';
import isPlainObject from './isPlainObject';

function ext<T>(target: T, source: T): T {
  if (isObject(source) && isObject(target)) {
    for (let key in source) {
      let item = source[key];

      if (isObject(item)) {
        if (isPlainObject(item) && !isPlainObject(target[key])) {
          (target as any)[key] = {};
        } else if (Array.isArray(item) && !Array.isArray(target[key])) {
          (target as any)[key] = [];
        }

        ext(target[key], item);
      } else {
        target[key] = item;
      }
    }
  }

  return target;
}
/**
 * @description 深拷贝
 * @param obj 要拷贝的对象
 * @returns 拷贝后的对象
 * @example
 * ```ts
 * import { cloneDeep } from '@szero/utils';
 * const obj = { a: 1, b: { c: 2, d: [3, 4] } };
 * const newObj = cloneDeep(obj);
 * console.log(newObj); // { a: 1, b: { c: 2, d: [3, 4] } }
 * ```
 */
export function cloneDeep<T>(obj: T): T | any[] {
  if (!isObject(obj)) return obj;

  let result: Array<any>;
  if (Array.isArray(obj)) {
    result = [];

    obj.forEach((item) => {
      result.push(cloneDeep(item));
    });
    return result;
  }

  return ext({} as T, obj) as T;
}
export default cloneDeep;
