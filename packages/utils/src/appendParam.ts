import isEmptyObject from './isEmptyObject';
import objectToParam from './objectToParam';
/**
 * 追加url参数
 * @param {string} url url参数
 * @param {string|object} key 名字或者对象
 * @param {string} value 值
 * @return {string} 返回新的url
 * @example
 * appendParam('lechebang.com', 'id', 3);
 * appendParam('lechebang.com?key=value', { cityId:2,cityName: '北京'});
 */
export function appendParam(
  url: string,
  key: string | Record<string, any>,
  value?: string
) {
  if (!key || isEmptyObject(key)) {
    return url;
  }
  let options: Record<string, any> = {};
  if (typeof key == 'string') {
    options[key] = value;
  } else {
    options = key;
  }

  let paramString: string = objectToParam(options);

  if (url.includes('?')) {
    url += '&' + paramString;
  } else {
    url += '?' + paramString;
  }

  return url;
}

export default appendParam;
