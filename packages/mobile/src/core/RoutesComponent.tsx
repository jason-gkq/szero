import React from 'react';
import { ErrorBlock, SpinLoading } from 'antd-mobile';
import { Routes, Route } from 'react-router-dom';
import { useEnv } from '@szero/hooks';
// import AnimatedRouter from 'react-animated-router';
// import 'react-animated-router/animate.css';
export interface IRouteProps {
  children?: IRouteProps[];
  path: string;
  component?: string | null;
  [key: string]: any;
}

const { appName, routes, route } = useEnv();

const getPageLazyComponent = (
  component: string
): React.ReactElement | undefined => {
  const Element: any = React.lazy(() => import(`@/src/pages/${component}`));

  if (!Element) {
    return;
  }
  return (
    <React.Suspense
      fallback={
        <SpinLoading
          color='currentColor'
          style={{
            '--size': '48px',
            zIndex: '1100',
            position: 'fixed',
            transform: 'translate(-50%, -50%)',
            top: '40%',
            left: '50%',
          }}
        />
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
const getRouters = (data: IRouteProps[], prefix = '') => {
  const res: any[] = [];
  for (let i = 0; i < data.length; i++) {
    const { children, path, component } = data[i];
    // 获取树形结构的path路径，用于获取component
    const newprefix = prefix ? `${prefix}/${path}` : path;
    if (children && Array.isArray(children) && children.length > 0) {
      const childrenRoutes: any[] = getRouters(children, newprefix);
      if (childrenRoutes.length > 0) {
        const Element = component && getPageLazyComponent(component.trim());
        if (Element) {
          res.push(
            <Route key={`${path}/*`} path={`${path}/*`}>
              <Route path='*' element={Element} />
              {childrenRoutes}
            </Route>
          );
        } else {
          res.push(
            <Route path={path} key={`${path}${i}`}>
              {childrenRoutes}
            </Route>
          );
        }
      }
    } else {
      const newElement = component ? component : newprefix;
      const Element = getPageLazyComponent(newElement && newElement.trim());
      if (Element) {
        res.push(<Route path={path} key={`${path}${i}`} element={Element} />);
      }
    }
  }
  return res;
};

const treeRoutes = getRouters(routes);
const rootPath = appName ? `/${appName}` : '/';
const { isAnimated } = route;

export default () => {
  const renderContent = (
    <Route path={rootPath}>
      {treeRoutes}
      <Route
        path='*'
        key='*'
        element={
          <React.Suspense
            fallback={
              <SpinLoading
                color='currentColor'
                style={{
                  '--size': '48px',
                  zIndex: '1100',
                  position: 'fixed',
                  transform: 'translate(-50%, -50%)',
                  top: '40%',
                  left: '50%',
                }}
              />
            }
          >
            <ErrorBlock status='empty' title='抱歉，你访问的页面不存在' />
          </React.Suspense>
        }
      />
    </Route>
  );

  return (
    <>
      {/* {isAnimated && (
        <AnimatedRouter className='body'>{renderContent}</AnimatedRouter>
      )}
      {!isAnimated && <Routes>{renderContent}</Routes>} */}
      <Routes>{renderContent}</Routes>
    </>
  );
};
