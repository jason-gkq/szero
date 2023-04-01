/**
 * 时间格式化
 * dateFormat("YYYY-mm-dd HH:MM:SS", 2021-12-30T09:02:24.000+08:00) => 2021-12-30 09:02:24
 *
 * @param fmt
 * @param date
 * @returns
 */
export function dateFormat(fmt: string, date: Date | string) {
  if (!date) {
    return "";
  }
  date = new Date(date);
  let ret;
  const opt: { [key: string]: any } = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
}

/**
 * 函数柯里化
 * f(a, b, c)
 * const newF = curry(f);
 * 调用方式：newF(a)(b)(c) || newF(a, b)(c) || newF(a)(b, c)
 * @param fn
 * @returns
 */
export function curry(fn: Function) {
  return function curriedFn(...args: any[]) {
    if (args.length < fn.length) {
      return function () {
        return curriedFn(...args.concat(Array.from(arguments)));
      };
    }

    return fn(...args);
  };
}
/**
 * 获取 uuid 唯一字符串
 * @returns
 */
export function guid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
/**
 * ===================== 类型判断 BEGIN ======================
 */
/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function getTag<T>(value?: T): string {
  if (value == null) {
    return value === undefined ? "[object Undefined]" : "[object Null]";
  }
  return Object.prototype.toString.call(value);
}
/**
 * 获取类型标签
 */
function getTypeof<T>(obj: T) {
  return Reflect.apply(Object.prototype.toString, obj, []).match(
    /\s+(\w+)\]$/
  )?.[1];
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * isObject({})
 * // => true
 *
 * isObject([1, 2, 3])
 * // => true
 *
 * isObject(Function)
 * // => true
 *
 * isObject(null)
 * // => false
 */
export function isObject<T>(value?: T): boolean {
  const type = typeof value;
  return value != null && (type === "object" || type === "function");
}
// export function isObject<T>(obj: T): boolean {
//   return isPlainObject(obj) || Array.isArray(obj)
// }
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * isObjectLike({})
 * // => true
 *
 * isObjectLike([1, 2, 3])
 * // => true
 *
 * isObjectLike(Function)
 * // => false
 *
 * isObjectLike(null)
 * // => false
 */
export function isObjectLike<T>(value?: T): boolean {
  return typeof value === "object" && value !== null;
}

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1
 * }
 *
 * isPlainObject(new Foo)
 * // => false
 *
 * isPlainObject([1, 2, 3])
 * // => false
 *
 * isPlainObject({ 'x': 0, 'y': 0 })
 * // => true
 *
 * isPlainObject(Object.create(null))
 * // => true
 */
export function isPlainObject<T>(value?: T): boolean {
  if (!isObjectLike(value) || getTag(value) != "[object Object]") {
    return false;
  }
  if (Object.getPrototypeOf(value) === null) {
    return true;
  }
  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
}

//  export function isPlainObject<T>(obj: T): boolean {
//     return getTypeof(obj) == 'Object'
//   }

export function isNumber<T>(obj: T): boolean {
  return getTypeof(obj) == "Number";
}

export function isString<T>(obj: T): boolean {
  return getTypeof(obj) == "String";
}

export function isArray<T>(obj: T): boolean {
  return Array.isArray(obj);
}

export function hasValue<T>(obj: T): boolean {
  return typeof obj !== "undefined";
}

/**
 * 判断对象是否为空
 * @param obj
 * @returns
 */
export function isEmptyObject<T>(obj?: T) {
  // return true;
  if (isObject(obj)) {
    if (JSON.stringify(obj) === "{}") {
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

export function isFunction<T>(obj: T): boolean {
  return getTypeof(obj) == "Function";
}

export function isDate<T>(obj: T): boolean {
  return getTypeof(obj) == "Date";
}

export function isPromise<T>(obj: T): boolean {
  return (
    typeof obj === "object" && obj && "function" == typeof (obj as any).then
  );
}

export function isUndefined<T>(obj: T): boolean {
  return obj === void 0;
}

export function isBoolean<T>(obj: T): boolean {
  return getTypeof(obj) == "Boolean";
}
/**
 * ===================== 类型判断 END ======================
 */

/**
 * ===================== 复杂类型常用数据处理 BEGIN ======================
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

/**
 * 数组深度摊平
 * @param data
 * @param rel
 * @returns
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

/**
 * 数组变成树形结构方法
 *
 * @param items
 * @param key 当前 id 名称
 * @param parentKey 父级id名称
 * @param childrenKey 子集存放数组名称
 * @returns
 */
export function arrayToTree(
  items: Array<any>,
  key: string,
  parentKey: string,
  childrenKey: string = "children",
  rootList: any[] = []
) {
  const result: any = [];
  const itemMap: any = {};
  const mapItems: any = {};
  /**
   * 如果没有传入跟节点，则先获取跟节点
   */
  if (!rootList || !isArray(rootList) || rootList.length <= 0) {
    items.forEach((item: any) => {
      mapItems[item[key]] = item;
    });
    items.forEach((item: any) => {
      if (!mapItems[item[parentKey]]) {
        rootList.push(item[key]);
      }
    });
  }

  for (const item of items) {
    const id = item[key];
    const pid = item[parentKey];

    if (!itemMap[id]) {
      itemMap[id] = {
        [childrenKey]: [],
      };
    }

    itemMap[id] = {
      ...item,
      [childrenKey]: itemMap[id][childrenKey],
    };
    const treeItem = itemMap[id];

    if (rootList.includes(id)) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          [childrenKey]: [],
        };
      }
      itemMap[pid][childrenKey].push(treeItem);
    }
  }
  return result;
}

/**
 * 数组去重
 * @param arr
 * @returns
 * unique([1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}])
 *  =>
 * [1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {}]
 */
export function unique(arr: any[]) {
  const obj = {};
  return arr.filter(function (item, index, arr) {
    return obj.hasOwnProperty(typeof item + item)
      ? false
      : ((obj as any)[typeof item + item] = true);
  });
}
/**
 * ===================== 复杂类型常用数据处理 END ======================
 */
/**
 * ===================== URL参数处理 BEGIN ======================
 */
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
  if (typeof key == "string") {
    options[key] = value;
  } else {
    options = key;
  }

  let paramString: string = objectToParam(options);

  if (url.includes("?")) {
    url += "&" + paramString;
  } else {
    url += "?" + paramString;
  }

  return url;
}

/**
 * 处理查询参数对象, 如果需要拼接在url参数里面，需要自行调用encodeURIComponent(util.param({k: 'v'}))
 * @param query
 * @param isEncode
 * @returns
 * objectToParam({key: value, k: v}) => key=value&k=v
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

  return params.join("&");
}

/**
 * 获取url参数
 * @param {string} query url参数
 * @param {object} obj 基础对象，可以不传
 * @return {object} url参数对象
 * @example
 * paramToObject('lechebang.com?key=value&city=3', {a: 1}) => {a: 1, key: value, city: 3}
 * paramToObject('lechebang.com?key=value&city=3') => {key: value, city: 3}
 * paramToObject(location.search) => {}
 * // 如果参数里面有url或者中文，请先自行先encodeURIComponent字符串
 */
export function paramToObject(
  query: string,
  obj?: Record<string, any> | unknown
) {
  var ret: any = obj || {};
  var searchReg = /([^&=?]+)=([^&]+)/g;
  var name, value;
  let match = searchReg.exec(query);

  while (match) {
    name = match[1];
    value = match[2];
    ret[name] = decodeURIComponent(value);
    match = searchReg.exec(query);
  }

  return ret;
}

export function deleteUndefined(data: Record<string, any>) {
  return Object.keys(data)
    .filter((key) => data[key] !== null && data[key] !== undefined)
    .reduce((acc, key) => ({ ...acc, [key]: data[key] }), {});
}

/**
  //  * 节流: 一定时间内，只触发一次回调
  //  * 场景: 监听页面滚动
  //  * @link [throttle](https://underscorejs.org/#throttle)
  //  * @example
  //  * let fn = util.debounce(function() {}, 300)
  //  */
// export function throttle(func: Function, wait: number, options: any) {
//   var context, args, result
//   var timeout = null
//   var previous = 0
//   if (!options) options = {}
//   function later() {
//     previous = options.leading === false ? 0 : Date.now()
//     timeout = null
//     result = applyToCall(func, context, args)
//     if (!timeout) context = args = null
//   }
//   return function() {
//     var now = Date.now()
//     if (!previous && options.leading === false) previous = now
//     var remaining = wait - (now - previous)
//     context = this
//     args = arguments
//     if (remaining <= 0 || remaining > wait) {
//       if (timeout) {
//         clearTimeout(timeout)
//         timeout = null
//       }
//       previous = now
//       result = applyToCall(func, context, args)
//       if (!timeout) context = args = null
//     } else if (!timeout && options.trailing !== false) {
//       timeout = setTimeout(later, remaining)
//     }
//     return result
//   }
// }

// /**
//  * 防抖动: 每次执行，自动清除上次的计时器，延迟指定时间后，执行回调
//  * 场景: 监听input事件，动态返回查询结果
//  * @link [throttle](https://underscorejs.org/#debounce)
//  * @example
//  * let fn = util.debounce(function() {}, 300)
//  */
// export function debounce(func: Function, wait: number, immediate = false) {
//   let timeout: any = null;
//   let args: any;
//    let context: any;
//    let timestamp: number;
//    let result: any;

//   function later() {
//     var last = Date.now() - timestamp

//     if (last < wait && last >= 0) {
//       timeout = setTimeout(later, wait - last)
//     } else {
//       timeout = null
//       if (!immediate) {
//         result = applyToCall(func, context, args)
//         if (!timeout) context = args = null
//       }
//     }
//   }

//   return function(...params: any) {
//     context = this
//     args = params
//     timestamp = Date.now()
//     var callNow = immediate && !timeout
//     if (!timeout) timeout = setTimeout(later, wait)
//     if (callNow) {
//       result = applyToCall(func, context, args)

//       context = args = null
//     }

//     return result
//   }
// }
/**
 * ===================== URL参数处理 END ======================
 */
