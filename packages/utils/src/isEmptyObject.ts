import isPlainObject from './isPlainObject';
/**
 * 判断对象是否为空
 * @param obj
 * @returns
 */
export function isEmptyObject<T>(obj?: T) {
  // return true;
  if (isPlainObject(obj)) {
    if (JSON.stringify(obj) === '{}') {
      return true;
    }
    return false;
    // for (let key in obj) {
    //   if ((Object as any).prototype.call(obj, key)) {
    //     return false;
    //   }
    // }
    // return true;
  }
  return false;
}

export default isEmptyObject;
