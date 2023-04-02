import { useState } from "react";
/* 自定义合并依赖项 */

export interface IUseMergeState {
  <S>(initialState?: Partial<S>): [Partial<S>, (newState: Partial<S>) => void];
}

// let useMergeState: IUseMergeState;
// export const useMergeState: IUseMergeState = function <S>(
//   initialState?: Partial<S>
// ) {
//   const [state, setState] = useState<Partial<S>>(initialState || ({} as S));
//   const setMergeState = (newState: Partial<S>) =>
//     setState((prevState) => ({
//       ...prevState,
//       ...newState,
//     }));

//   return [state, setMergeState];
// };

export const useMergeState = (initialState?: any) => {
  const [state, setState] = useState(initialState);
  const setMergeState = (newState: any) =>
    setState((prevState: any) => ({
      ...prevState,
      ...newState,
    }));
  return [state, setMergeState];
};

// export const useMergeState = <S,>(
//   initialState?: S | (() => S)
// ): [S, (newState: Partial<S>) => void] => {
//   const [state, setState] = useState<S>(initialState || ({} as S));
//   const setMergeState: (newState: Partial<S>) => void = (
//     newState: Partial<S>
//   ) =>
//     setState((prevState: S) => ({
//       ...prevState,
//       ...newState,
//     }));
//   return [state, setMergeState];
// };
