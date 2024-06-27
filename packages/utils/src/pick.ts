/**
 * @description 从对象中挑选部分属性
 * @param obj
 * @param keys
 * @returns
 * @example
 * ```
 * pick({a: 1, b: 2, c: 3}, ['a', 'b']) // {a: 1, b: 2}
 * ```
 */
export function pick(obj: Record<string, any>, keys: any[]) {
  let result: any = {};

  if (!obj) {
    return result;
  }
  keys.forEach((item) => {
    if (Reflect.has(obj, item)) {
      result[item] = obj[item];
    }
  });

  return result;
}

export default pick;
