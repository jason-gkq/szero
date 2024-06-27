import restArguments from './restArguments';
import now from './now';

// When a sequence of calls of the returned function ends, the argument
// function is triggered. The end of a sequence is defined by the `wait`
// parameter. If `immediate` is passed, the argument function will be
// triggered at the beginning of the sequence instead of at the end.
type AnyFunction = (...args: any[]) => any;
/**
 * @description 防抖动: 每次执行，自动清除上次的计时器，延迟指定时间后，执行回调
 * @link [debounce](https://underscorejs.org/#debounce)
 * @example
 * let fn = debounce(function() {}, 300)
 */
export function debounce(func: AnyFunction, wait: number, immediate?: boolean) {
  let timeout: any, previous: any, args: any, result: any, context: any;

  const later = function () {
    const passed = now() - previous;
    if (wait > passed) {
      timeout = setTimeout(later, wait - passed);
    } else {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
      // This check is needed because `func` can recursively invoke `debounced`.
      if (!timeout) args = context = null;
    }
  };

  const debounced: any = restArguments(function (_args) {
    // @ts-ignore
    context = this;
    args = _args;
    previous = now();
    if (!timeout) {
      timeout = setTimeout(later, wait);
      if (immediate) result = func.apply(context, args);
    }
    return result;
  });

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = args = context = null;
  };

  return debounced;
}

export default debounce;
