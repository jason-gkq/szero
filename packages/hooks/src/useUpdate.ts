import { useCallback, useState } from 'react';
/**
 * @description 强制更新
 */
const useUpdate = () => {
  const [, setState] = useState({});
  return useCallback(() => setState({}), []);
};

export default useUpdate;
