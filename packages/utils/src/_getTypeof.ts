/**
 * 获取类型标签
 */
export default function getTypeof<T>(obj: T) {
  return Reflect.apply(Object.prototype.toString, obj, []).match(
    /\s+(\w+)\]$/
  )?.[1];
}
