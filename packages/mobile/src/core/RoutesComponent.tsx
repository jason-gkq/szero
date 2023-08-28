import React from 'react';
import { ErrorBlock, SpinLoading } from 'antd-mobile';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEnv } from '@szero/hooks';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

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
      const Element = component && getPageLazyComponent(component.trim());
      if (childrenRoutes.length > 0) {
        if (Element) {
          res.push(
            <Route path={path} key={path} element={Element}>
              <Route index key={'index'} element={Element} />
              {childrenRoutes}
            </Route>
          );
        } else {
          const nextPath = appName
            ? `/${appName}/${newprefix}/${children[0]['path']}`
            : `/${newprefix}/${children[0]['path']}`;
          res.push(
            <Route path={path} key={path}>
              <Route index key='index' element={<Navigate to={nextPath} />} />
              {childrenRoutes}
            </Route>
          );
        }
      } else {
        if (Element) {
          res.push(<Route path={path} key={path} element={Element} />);
        }
      }
    } else {
      const newElement = component ? component : newprefix;
      const Element = getPageLazyComponent(newElement && newElement.trim());
      if (Element) {
        res.push(<Route path={path} key={path} element={Element} />);
      }
    }
  }
  return res;
};

const treeRoutes = getRouters(routes);
const rootPath = appName ? `/${appName}` : '/';
const { isAnimated } = route;

{
  /* <Route
        render={({ location }) => {
          return (
            <TransitionGroup>
              <CSSTransition
                key={location.key}
                classNames={{
                  enter: 'animated',
                  enterActive: 'fadeInDown',
                  exit: 'animated',
                  exitActive: 'fadeOutDown'
                }}
                timeout={1000}
                mountOnEnter
                unmountOnExit
              >
                <div>
                  <Switch location={location}>
                    <Route
                      path="/one"
                      render={(props) => (
                        <KeepAlive>
                          <Test {...props} />
                        </KeepAlive>
                      )}
                    />
                    <Route path="/two" render={() => 'This is two'} />
                  </Switch>
                </div>
              </CSSTransition>
            </TransitionGroup>
          )
        }}
      /> */
}

export default () => {
  const location = useLocation();

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
      {isAnimated && (
        <TransitionGroup component={null}>
          <CSSTransition key={location.key} classNames='fade' timeout={300}>
            <Routes location={location}>{renderContent}</Routes>
          </CSSTransition>
        </TransitionGroup>
      )}
      {!isAnimated && <Routes>{renderContent}</Routes>}
      {/* <Routes>{renderContent}</Routes> */}
    </>
  );
};
