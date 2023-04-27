export function deleteUndefined(data: Record<string, any>) {
  return Object.keys(data)
    .filter((key) => data[key] !== null && data[key] !== undefined)
    .reduce((acc, key) => ({ ...acc, [key]: data[key] }), {});
}

export default deleteUndefined;
