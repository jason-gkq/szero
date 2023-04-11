import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { SpinLoading, Mask, Footer, ErrorBlock, Skeleton } from 'antd-mobile';
import { useLocation } from 'react-router-dom';
import { paramToObject } from '@szero/utils';
import { observer } from 'mobx-react-lite';
import { useEnv, useMergeState } from '@szero/hooks';
import { navigate } from '@szero/navigate';
import { pageStore, rootStore, INavBar } from '../store';
import { runInAction } from 'mobx';
interface IConfig {
  isNeedLogin?: boolean;
}

export interface IPageConfig extends IConfig {
  pageId?: string;
  permissions?: string[];
  navBar?: INavBar;
  isShowFooter?: boolean;
}

export interface ICProps {
  route: string;
  params?: any;
  [key: string]: any;
}

const { appName, layout } = useEnv();

let clickTimes = 0;

const createPage = (pageConfig: IPageConfig, WrappedComponent: any) => {
  return observer(() => {
    const { pathname, state, search } = useLocation();
    const route = appName
      ? String(pathname).replace(`/${appName}`, '')
      : pathname;
    const params = paramToObject(search, state);
    const [isOnload, setIsOnload] = useState(false);
    const [minHeight, setMinHeight] = useState(0);
    useLayoutEffect(() => {
      runInAction(() => {
        pageStore.route = route;
        pageStore.params = params;
        if (Reflect.has(pageConfig, 'navBar')) {
          pageStore.navBar = pageConfig.navBar;
        }
        if (Reflect.has(pageConfig, 'isShowFooter') || pageStore.isShowFooter) {
          pageStore.isShowFooter = !!pageConfig.isShowFooter;
        }
        pageStore.pageStatus = 'loading';
      });

      clickTimes = 0;
      const isOnload =
        rootStore.appStore.pageBeforeOnLoad &&
        rootStore.appStore.pageBeforeOnLoad({
          pageStore,
          params,
          route,
          pageConfig,
        });
      setIsOnload(!!isOnload);
      /**
       * 前置执行 onLoad 方法；
       */
      pageStore.onLoad && pageStore.onLoad({ route, params });
    }, [route, JSON.stringify(params)]);
    useEffect(() => {
      let otherHeight = 0;
      if (pageStore.isShowNavBar) {
        otherHeight += 46;
      }
      if (pageStore.isShowTabBar) {
        otherHeight += 50;
      }
      setMinHeight(otherHeight);
    }, [pageStore.isShowNavBar, pageStore.isShowTabBar]);
    useEffect(() => {
      pageStore.onReady && pageStore.onReady({ route, params });
      return () => {
        pageStore.onUnload && pageStore.onUnload();
      };
    }, []);

    const renderNoSucess = useCallback(() => {
      switch (pageStore.pageStatus) {
        case 'loading':
          return (
            <>
              <Mask visible={true} opacity='thin' color='white' />
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
            </>
          );
        case 'skeleton':
          return (
            <>
              <Skeleton.Title animated />
              <Skeleton.Paragraph lineCount={5} animated />
            </>
          );
        default:
          const { children, ...restErrorInfo } = pageStore.errorInfo || {};
          return (
            <ErrorBlock fullPage {...restErrorInfo}>
              {children}
            </ErrorBlock>
          );
      }
    }, [pageStore.pageStatus]);

    return (
      <>
        {pageStore.pageStatus != 'success' && renderNoSucess()}
        <div
          className='page-body'
          style={{
            minHeight: `calc(100vh - env(safe-area-inset-bottom) - ${minHeight}px)`,
            visibility:
              pageStore.pageStatus == 'success' ? 'inherit' : 'hidden',
          }}
        >
          {isOnload && (
            <div style={{ flex: 'auto', display: 'flex' }}>
              <WrappedComponent<ICProps> route={route} params={params} />
            </div>
          )}
          {pageStore.isShowFooter && (
            <div style={{ flex: '0 0 30px' }}>
              <Footer
                style={{ backgroundColor: '#eee' }}
                content={
                  <div
                    onClick={() => {
                      if (clickTimes >= 6) {
                        navigate.goTo('/tools');
                      } else {
                        clickTimes++;
                      }
                    }}
                  >
                    {layout.footerText}
                  </div>
                }
              />
            </div>
          )}
        </div>
      </>
    );
  });
};

export default createPage;
