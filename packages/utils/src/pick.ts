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

export default pick;
