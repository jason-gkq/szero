export function isPromise<T>(obj: T): boolean {
  return (
    typeof obj === 'object' && obj && 'function' == typeof (obj as any).then
  );
}

export default isPromise;
