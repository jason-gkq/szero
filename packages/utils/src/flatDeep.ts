/**
 * @description 数组深度摊平
 * @param data
 * @param rel
 * @returns
 * @example
 * flatDeep([1, [2, [3, 4], 5], 6]) => [1, 2, 3, 4, 5, 6]
 */
export function flatDeep(data?: any, rel: Array<any> = []) {
  if (!data) {
    return rel;
  }
  if (!Array.isArray(data)) {
    rel.push(data);
    return rel;
  }
  data.map((item) => {
    if (Array.isArray(item)) {
      return flatDeep(item, rel);
    } else {
      return rel.push(item);
    }
  });
  return rel;
}

export default flatDeep;
