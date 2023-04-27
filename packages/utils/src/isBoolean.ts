import getTypeof from './_getTypeof';

export function isBoolean<T>(obj: T): boolean {
  return getTypeof(obj) == 'Boolean';
}
export default isBoolean;
