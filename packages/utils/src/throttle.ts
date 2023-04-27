/**
 * 节流: 一定时间内，只触发一次回调
 * 场景: 监听页面滚动
 * @link [throttle](https://underscorejs.org/#throttle)
 * @example
 * let fn = util.debounce(function() {}, 300)
 */
type AnyFunction = (...args: any[]) => any;

export function throttle(
  func: AnyFunction,
  wait: number,
  options?: Record<string, any>
) {
  let timeout: any,
    context: any,
    args: any,
    result: any,
    previous = 0;

  if (!options) options = {};

  const later = function () {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  const throttled = function () {
    const _now = Date.now();
    if (!previous && options.leading === false) previous = _now;
    const remaining = wait - (_now - previous);
    // @ts-ignore
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = _now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

export default throttle;
