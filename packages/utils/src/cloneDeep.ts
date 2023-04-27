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
 * 深拷贝
 * @param obj
 * @returns
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
