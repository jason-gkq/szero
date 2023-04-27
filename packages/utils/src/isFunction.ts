import getTypeof from './_getTypeof';

export function isFunction<T>(obj: T): boolean {
  return getTypeof(obj) == 'Function';
}
export default isFunction;
