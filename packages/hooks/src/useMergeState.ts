import { useState, type Dispatch, type SetStateAction } from 'react';
/* 自定义合并依赖项 */

/**
 * @description 合并状态
 * @param initialState 初始状态
 * @returns
 * @example
 * ```tsx
 * const [state, setMergeState] = useMergeState({ count: 0 });
 * const [state, setMergeState] = useMergeState<ExampleState>({ count: 0, text: '' });
 * setMergeState({ count: 1 }); // { count: 1 }
 * setMergeState((prevState) => ({ count: prevState.count + 1 })); // { count: 2 }
 * ```
 */
export const useMergeState = <
  T extends Record<string, any> = Record<string, any>
>(
  initialState?: T
) => {
  const [state, setState] = useState<T | undefined>(initialState);
  const setMergeState: Dispatch<SetStateAction<Partial<T>>> = (newState) =>
    setState((prevState) => ({
      ...prevState,
      ...(typeof newState === 'function' ? newState(prevState) : newState),
    }));
  return [state, setMergeState] as const;
};
