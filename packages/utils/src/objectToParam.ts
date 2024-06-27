import isPlainObject from './isPlainObject';
/**
 * @description 需要拼接在url参数里面,处理查询参数对象
 * @param query
 * @param isEncode
 * @returns
 * @example
 * ```
 * objectToParam({key: value, k: v}) => key=value&k=v
 * ```
 */
export function objectToParam<T>(query: T, isEncode: boolean = true): string {
  const params: string[] = [];

  for (let i in query) {
    let value: any = query[i];

    if (isPlainObject(value)) {
      value = JSON.stringify(value);
    }

    params.push(`${i}=${isEncode ? encodeURIComponent(value) : value}`);
  }

  return params.join('&');
}

export default objectToParam;
