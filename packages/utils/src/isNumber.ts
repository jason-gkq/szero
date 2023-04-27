import getTypeof from './_getTypeof';

export function isNumber<T>(obj: T): boolean {
  return getTypeof(obj) == 'Number';
}

export default isNumber;
