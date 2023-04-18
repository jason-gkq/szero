import React, { useEffect, useState } from 'react';
import type { RouteProps } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { useEnv } from '@szero/hooks';

export interface IRouteProps {
  children?: IRouteProps[];
  path: string;
  isNoneLayout?: boolean;
  component?: string | null;
  layout?: string | null;
  [key: string]: any;
}

const Layout = React.lazy(
  () => import(/* webpackChunkName: 'app' */ '../components/layouts/proLayout')
);

const getPageLazyComponent = (
  component: string
): React.ReactElement | undefined => {
  if (!component || component === 'Layout') {
    return;
  }

  const Element: any = React.lazy(
    () => import(/* webpackMode: "lazy" */ `@/src/pages/${component}`)
  );

  if (!Element) {
    return;
  }
  return (
    <React.Suspense fallback={<Spin />}>
      <Element />
    </React.Suspense>
  );
};

/**
 * 构建Route树挂载所有路由
 * @param data
 * @param isLayout
 * @param prefix
 * @returns
 */
const getRouters = (
  data: IRouteProps[],
  isLayout = false,
  prefix = '',
  pIsNoneLayout?: boolean | undefined
) => {
  const res: any[] = [];
  for (let i = 0; i < data.length; i++) {
    const { children, path, isNoneLayout, component, layout } = data[i];
    // 获取树形结构的path路径，用于获取component
    const newprefix = prefix ? `${prefix}/${path}` : path;
    if (children && Array.isArray(children) && children.length > 0) {
      // 父级layout向下透传
      const newPIsLayout = Reflect.has(data[i], 'isNoneLayout')
        ? isNoneLayout
        : pIsNoneLayout;

      const childrenRoutes: any[] = getRouters(
        children,
        isLayout,
        newprefix,
        newPIsLayout
      );
      const Layout = layout && getPageLazyComponent(layout.trim());
      if (childrenRoutes.length > 0) {
        const Element = component && getPageLazyComponent(component.trim());
        if (Element) {
          res.push(
            <Route key={`${path}/*`} path={`${path}/*`} element={Layout}>
              <Route path='*' element={Element} />
              {childrenRoutes}
            </Route>
          );
        } else {
          res.push(
            <Route path={path} key={`${path}${i}`} element={Layout}>
              {childrenRoutes}
            </Route>
          );
        }
      }
    } else {
      let flag;
      /**
       * 优先当前节点定义
       * 其次为父级节点定义
       * 如果都没定义则取默认值 false
       */
      if (!Object.is(isNoneLayout, undefined)) {
        flag = isNoneLayout;
      } else if (!Object.is(pIsNoneLayout, undefined)) {
        flag = pIsNoneLayout;
      } else {
        flag = Boolean(isNoneLayout);
      }
      if (Object.is(isLayout, flag)) {
        const newElement = component ? component : newprefix;
        const Element = getPageLazyComponent(newElement && newElement.trim());
        if (Element) {
          res.push(<Route path={path} key={`${path}${i}`} element={Element} />);
        }
      }
    }
  }
  return res;
};
/**
 * 本地路由树和接口路有树合并去重
 * @param tree
 * @returns
 */
const treeIterator = (tree: any[]) => {
  const arr: any[] = [];
  if (!Array.isArray(tree) || !tree.length) return arr;
  tree.forEach((e: any) => {
    const index = arr.findIndex((i) => i.path == e.path);
    if (e.children) {
      if (index > -1) {
        arr[index] = {
          ...e,
          ...arr[index],
          children: treeIterator([
            ...(arr[index].children || []),
            ...(e.children || []),
          ]),
        };
      } else {
        arr.push({ ...e, children: treeIterator(e.children) });
      }
    } else {
      if (index < 0) {
        arr.push({ ...e });
      } else {
        arr[index] = { ...e, ...arr[index] };
      }
    }
  });

  return arr;
};

type IProps = {
  routes: RouteProps[];
};

const { appName, routes: configRoutes = [] } = useEnv();

export default ({ routes }: IProps) => {
  const [treeRoutes, setTreeRoutes] = useState<any>();
  const [treeNoRoutes, setTreeNoRoutes] = useState<any>();
  useEffect(() => {
    const treeData = treeIterator(configRoutes.concat(routes));
    setTreeRoutes(getRouters(treeData, false));
    setTreeNoRoutes(getRouters(treeData, true));
  }, [JSON.stringify(routes), JSON.stringify(configRoutes)]);
  // const rootPath = appName ? `/${appName}` : '/';

  return (
    <Routes>
      <Route path={`/`}>
        {treeNoRoutes}
        <Route
          path='*'
          element={
            <React.Suspense
              fallback={
                <div
                  style={{
                    height: '100vh',
                  }}
                >
                  <Spin />
                </div>
              }
            >
              <Layout />
            </React.Suspense>
          }
        >
          {treeRoutes}
          <Route
            path='*'
            key='*'
            element={
              <React.Suspense fallback={<Spin />}>
                <Result
                  status={404}
                  title='页面不存在'
                  subTitle='您好，您访问的页面不存在，请刷新重试.'
                  extra={
                    <Button
                      type='primary'
                      danger
                      onClick={() => {
                        window.location.reload();
                      }}
                    >
                      刷新页面
                    </Button>
                  }
                  style={{
                    height: '100%',
                    background: '#fff',
                  }}
                />
              </React.Suspense>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};
