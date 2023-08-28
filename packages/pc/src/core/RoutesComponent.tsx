import React from 'react';
import type { RouteProps } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { isString } from '@szero/utils';

export interface IRouteProps {
  children?: IRouteProps[];
  path: string;
  isRouteRoot?: boolean;
  isPlugin?: boolean;
  isNoneLayout?: boolean;
  component?: string | null;
  layout?: string | null;
  [key: string]: any;
}

const Layout = React.lazy(
  () => import(/* webpackChunkName: 'app' */ '../components/layouts/proLayout')
);

const getPageLazyComponent = (component: string) => {
  if (!component || !isString(component)) {
    return component;
  }

  const Element: any = React.lazy(
    () => import(/* webpackMode: "lazy" */ `@/src/pages/${component}`)
  );

  if (!Element) {
    return;
  }
  return (
    <React.Suspense
      fallback={
        <div
          style={{
            height: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spin size='large' />
        </div>
      }
    >
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
export const getRouters = (
  data: IRouteProps[],
  isLayout = false,
  prefix = '',
  pIsNoneLayout?: boolean | undefined
) => {
  const res: any[] = [];
  if (!data || data.length == 0) {
    return res;
  }
  for (let i = 0; i < data.length; i++) {
    const { children, path, isNoneLayout, isPlugin, component, layout } =
      data[i];
    if (path.startsWith('http')) {
      continue;
    }
    if (!!isPlugin) {
      const Element = component && getPageLazyComponent(component.trim());
      if (Object.is(isLayout, !!isNoneLayout)) {
        res.push(
          <Route path={`${path}/*`} key={`${path}${i}`} element={Element} />
        );
      }
      continue;
    }
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
      const Element = component && getPageLazyComponent(component.trim());

      if (childrenRoutes.length > 0) {
        if (Layout && Element) {
          res.push(
            <Route path={path} key={path} element={Layout}>
              <Route path='/' element={Element} />
              {childrenRoutes}
            </Route>
          );
        } else if (!Layout && Element) {
          res.push(
            <Route path={path} key={path} element={Element}>
              {childrenRoutes}
            </Route>
          );
        } else if (Layout && !Element) {
          res.push(
            <Route path={path} key={path} element={Layout}>
              {childrenRoutes}
            </Route>
          );
        } else {
          res.push(
            <Route path={path} key={path}>
              <Route
                path='/'
                element={<Navigate to={`/${children[0]['path']}`} />}
              />
              {childrenRoutes}
            </Route>
          );
        }

        // if (i == 0) {
        //   res.push(
        //     <Route
        //       index
        //       key={`${path}-index`}
        //       element={<Routes>{childrenRoutes}</Routes>}
        //     />
        //   );
        //   if (Element) {
        //     res.push(
        //       <Route path={`${path}/*`} key={path} element={Layout}>
        //         <Route path='/' element={Element} />
        //         {childrenRoutes}
        //       </Route>
        //     );
        //   } else {
        //     res.push(
        //       <Route path={path} key={path} element={Layout}>
        //         {childrenRoutes}
        //       </Route>
        //     );
        //   }
        // } else {
        //   if (Element) {
        //     res.push(
        //       <Route path={`${path}/*`} key={path} element={Layout}>
        //         <Route path='/' element={Element} />
        //         {childrenRoutes}
        //       </Route>
        //     );
        //   } else {
        //     res.push(
        //       <Route path={path} key={path} element={Layout}>
        //         {childrenRoutes}
        //       </Route>
        //     );
        //   }
        // }
      } else {
        if (Layout && Element) {
          res.push(
            <Route path={path} key={path} element={Layout}>
              <Route path='/' element={Element} />
            </Route>
          );
        } else if (!Layout && Element) {
          res.push(<Route path={path} key={path} element={Element} />);
        } else if (Layout && !Element) {
          res.push(<Route path={path} key={path} element={Layout} />);
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
          if (i == 0) {
            res.push(
              <Route
                path='/'
                index
                key='index'
                element={<Navigate to={`/${path}`} />}
              />
            );
            // res.push(<Route index key={`${path}-index`} element={Element} />);
          }
          res.push(<Route path={path} key={path} element={Element} />);
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

export default ({ routes }: IProps) => {
  if (!routes || routes.length == 0) {
    return (
      <Routes>
        <Route
          path='*'
          key='*'
          element={
            <React.Suspense fallback={<Spin />}>
              <PageContainer pageHeaderRender={false}>
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
              </PageContainer>
            </React.Suspense>
          }
        />
      </Routes>
    );
  }
  const routesData = treeIterator(routes) || [];
  const { path, children } = routesData.find((i) => !!i.isRouteRoot) || {};
  const rootPath = path && path.startsWith('/') ? path : `/${path}`;
  const treeRoutes = children ? getRouters(children, false) : [];
  const treeNoRoutes = children ? getRouters(children, true) : [];

  return (
    <Routes>
      <Route path={rootPath}>
        {treeNoRoutes}
        <Route
          path='*'
          element={
            <React.Suspense
              fallback={
                <div
                  style={{
                    height: '60vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Spin size='large' />
                </div>
              }
            >
              <Layout routesData={routesData} />
            </React.Suspense>
          }
        >
          {treeRoutes}
          <Route
            path='*'
            key='*'
            element={
              <React.Suspense fallback={<Spin />}>
                <PageContainer pageHeaderRender={false}>
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
                </PageContainer>
              </React.Suspense>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};
