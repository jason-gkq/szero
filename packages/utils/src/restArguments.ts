type AnyFunction = (...args: any[]) => any;
// Some functions take a variable number of arguments, or a few expected
// arguments at the beginning and then a variable number of values to operate
// on. This helper accumulates all remaining arguments past the function’s
// argument length (or an explicit `startIndex`), into an array that becomes
// the last argument. Similar to ES6’s "rest parameter".
export function restArguments(func: AnyFunction, startIndex?: number) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function () {
    const length = Math.max(arguments.length - startIndex, 0),
      rest = Array(length);

    for (let index = 0; index < length; index++) {
      rest[index] = arguments[index + startIndex];
    }
    switch (startIndex) {
      case 0:
        // @ts-ignore
        return func.call(this, rest);
      case 1:
        // @ts-ignore
        return func.call(this, arguments[0], rest);
      case 2:
        // @ts-ignore
        return func.call(this, arguments[0], arguments[1], rest);
    }
    const args = Array(startIndex + 1);
    for (let index = 0; index < startIndex; index++) {
      args[index] = arguments[index];
    }
    args[startIndex] = rest;
    // @ts-ignore
    return func.apply(this, args);
  };
}
export default restArguments;
