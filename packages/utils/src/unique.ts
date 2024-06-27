/**
 * @description 数组去重
 * @param arr
 * @returns
 * ```
 * unique([1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}])
 * // [1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {}]
 * ```
 */
export function unique(arr: any[]) {
  const obj = {};
  return arr.filter(function (item, index, arr) {
    return obj.hasOwnProperty(typeof item + item)
      ? false
      : ((obj as any)[typeof item + item] = true);
  });
}

export default unique;
