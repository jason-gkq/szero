import getTypeof from './_getTypeof';

export function isString<T>(obj: T): boolean {
  return getTypeof(obj) == 'String';
}
export default isString;
