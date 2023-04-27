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

export default curry;
