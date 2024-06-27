import { useRef } from 'react';
import type { DependencyList } from 'react';

/* 1. useCreation 的参数与useMemo的一致，第一个参数是函数，第二个参数参数是可变的数组 */
const depsAreSame = (
  oldDeps: DependencyList,
  deps: DependencyList
): boolean => {
  if (oldDeps === deps) return true;

  for (let i = 0; i < oldDeps.length; i++) {
    // 判断两个值是否是同一个值
    if (!Object.is(oldDeps[i], deps[i])) return false;
  }

  return true;
};

/**
 * @description useMemo 或 useRef的替代品
 * useMemo的值不一定是最新值，但useCreation可以保证拿到的值一定是最新的值
 * 对于复杂常量的创建，useRef容易出现潜在的的性能隐患，但useCreation可以避免
 * 这里的性能隐患是指：
 *  每次重渲染，都会执行实例化 Subject 的过程，即便这个实例立刻就被扔掉了
 *  const a = useRef(new Subject())
 *  通过 factory 函数，可以避免性能隐患
 *  const b = useCreation(() => new Subject(), [])
 * @example
 * 我们可以看到，当我们做无关的state改变的时候，正常的函数也会刷新，但useCreation没有刷新，从而增强了渲染的性能～
 * ```tsx
 *  import React, { useState } from 'react';
 *  import { Button } from 'antd-mobile';
 *  import { useCreation } from '@/components';
 *
 *  const Index: React.FC<any> = () => {
 *    const [_, setFlag] = useState<boolean>(false)
 *
 *    const getNowData = () => {
 *      return Math.random()
 *    }
 *
 *    const nowData = useCreation(() => getNowData(), []);
 *
 *    return (
 *      <div style={{padding: 50}}>
 *        <div>正常的函数：{getNowData()}</div>
 *        <div>useCreation包裹后的：{nowData}</div>
 *        <Button color='primary' onClick={() => {setFlag(v => !v)}}> 渲染</Button>
 *      </div>
 *    )
 *  }
 *
 *  export default Index;
 * ```
 */
const useCreation = <T>(fn: () => T, deps: DependencyList) => {
  /* 2. 我们的值要保存在 useRef中，这样可以将值缓存，从而减少无关的刷新 */
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T,
    initialized: false,
  });
  /* 3. 是否更新值： 通过initialized 和 depsAreSame来判断*/
  /* 其中depsAreSame通过存储在 useRef下的deps(旧值) 和 新传入的 deps（新值）来做对比，判断两数组的数据是否一致，来确定是否更新 */
  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.deps = deps;
    current.obj = fn();
    current.initialized = true;
  }
  return current.obj as T;
};

export default useCreation;
