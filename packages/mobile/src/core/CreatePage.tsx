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
import { useEnv } from '@szero/hooks';
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

const { appName, layout } = useEnv();

let clickTimes = 0;

const createPage = (pageConfig: IPageConfig, WrappedComponent: any) => {
  return observer(() => {
    const { pathname, state, search } = useLocation();
    const params = paramToObject(search, state);
    const [isOnload, setIsOnload] = useState(false);

    useLayoutEffect(() => {
      runInAction(() => {
        pageStore.route = appName
          ? String(pathname).replace(`/${appName}`, '')
          : pathname;
        pageStore.params = params;
        pageStore.navBar = pageConfig.navBar;
        pageStore.isShowFooter = !!pageConfig.isShowFooter;
        pageStore.pageStatus = 'loading';
      });

      clickTimes = 0;
      const isOnload =
        rootStore.appStore.pageBeforeOnLoad &&
        rootStore.appStore.pageBeforeOnLoad({
          pageStore,
          params,
          route: pathname,
          pageConfig,
        });
      setIsOnload(!!isOnload);
      /**
       * 前置执行 onLoad 方法；
       */
      pageStore.onLoad && pageStore.onLoad(params);
    }, [pathname, JSON.stringify(params)]);

    useEffect(() => {
      pageStore.onReady && pageStore.onReady(params);
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
        case 'error':
          const { children, ...restErrorInfo } = pageStore.errorInfo || {};
          return (
            <ErrorBlock fullPage {...restErrorInfo}>
              {children}
            </ErrorBlock>
          );
        default:
          return <></>;
      }
    }, [pageStore.pageStatus]);

    return (
      <>
        {pageStore.pageStatus != 'success' && renderNoSucess()}
        <div
          className='page-body'
          style={{
            visibility:
              pageStore.pageStatus == 'success' ? 'inherit' : 'hidden',
          }}
        >
          {isOnload && <WrappedComponent />}
        </div>
        {pageStore.isShowFooter && (
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
        )}
      </>
    );
  });
};

export default createPage;
