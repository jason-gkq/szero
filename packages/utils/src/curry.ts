type AnyFunction = (...args: any[]) => any;

/**
 * @description 函数柯里化
 * @param fn - 待柯里化的函数
 * @returns 返回一个柯里化后的函数
 * @example
 * ```typescript
 * const add = (a: number, b: number, c: number) => a + b + c;
 * const curriedAdd = curry(add);
 * curriedAdd(1)(2)(3); // 6
 * curriedAdd(1, 2)(3); // 6
 * curriedAdd(1)(2, 3); // 6
 * ```
 */
export function curry<T extends AnyFunction>(fn: T) {
  return function curriedFn(
    ...args: Parameters<T>
  ): ReturnType<T> | typeof curriedFn {
    if (args.length < fn.length) {
      return function (...nextArgs: Parameters<T>) {
        const allArgs = { ...args, ...nextArgs };
        return curriedFn(...allArgs);
      };
    }

    return fn(...args);
  };
}

export default curry;
