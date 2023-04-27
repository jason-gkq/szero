import getTypeof from './_getTypeof';

export function isDate<T>(obj: T): boolean {
  return getTypeof(obj) == 'Date';
}

export default isDate;
