/**
 * 删除对象中值为 undefined 或 null 的键值对
 * @param data 要处理的对象
 * @returns 处理后的对象
 * @example
 * ```typescript
 * const obj = { a: 1, b: null, c: undefined, d: 'hello' };
 * deleteUndefined(obj); // { a: 1, d: 'hello' }
 * ```
 */
export function deleteUndefined(data: Record<string, any>) {
  return Object.keys(data)
    .filter((key) => data[key] !== null && data[key] !== undefined)
    .reduce((acc, key) => ({ ...acc, [key]: data[key] }), {});
}

export default deleteUndefined;
