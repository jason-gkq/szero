import React, {
  useCallback,
  useEffect,
  useState,
  useLayoutEffect,
} from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { useLocation } from 'react-router-dom';
import { Spin, Skeleton, Result } from 'antd';
import { observer } from 'mobx-react-lite';
import { runInAction, toJS } from 'mobx';
import { paramToObject } from '@szero/utils';
import { pageStore, rootStore } from '../store';

export interface IPageConfig {
  pageId?: string;
  permissions?: string[];
  isNeedLogin?: boolean;
  pageStatus?: 'loading' | 'skeleton' | 'error' | 'success';
  skeletonOptions?: Record<string, any>;
  loadingOptions?: Record<string, any>;
  [key: string]: any;
}

export interface ICProps {
  route: string;
  params?: any;
  [key: string]: any;
}

export default (pageConfig: IPageConfig) => (WrappedComponent: any) => {
  return observer(() => {
    const { pathname, state, search } = useLocation();
    const route = pathname;
    const params = paramToObject(search, state);
    const errorInfo = toJS(pageStore.errorInfo) || {};
    const [isOnload, setIsOnload] = useState(false);

    useLayoutEffect(() => {
      runInAction(() => {
        pageStore.route = route;
        pageStore.params = params;
        pageStore.isShowFooter = !!pageConfig.isShowFooter;
        pageStore.pageStatus = pageConfig.pageStatus || 'success';
      });

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
      pageStore.onReady && pageStore.onReady({ route, params });
      return () => {
        pageStore.onUnload && pageStore.onUnload();
      };
    }, []);

    const renderNoSucess = useCallback(() => {
      switch (pageStore.pageStatus) {
        case 'loading':
          const loadingOptions = pageConfig.loadingOptions || {};
          return (
            <PageContainer pageHeaderRender={false}>
              <div
                style={{
                  height: '60vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Spin size='large' {...loadingOptions} />
              </div>
            </PageContainer>
          );
        case 'skeleton':
          const skeletonOptions = pageConfig.skeletonOptions || {};
          return (
            <PageContainer pageHeaderRender={false}>
              <Skeleton
                active
                style={{ marginTop: '25px', width: '80%', marginLeft: '25px' }}
                {...skeletonOptions}
              />
            </PageContainer>
          );
        default:
          return (
            <PageContainer pageHeaderRender={false}>
              <Result {...(errorInfo || {})} />
            </PageContainer>
          );
      }
    }, [pageStore.pageStatus]);

    return (
      <>
        {pageStore.pageStatus != 'success' && renderNoSucess()}
        <div
          style={{
            visibility:
              pageStore.pageStatus == 'success' ? 'inherit' : 'hidden',
          }}
        >
          {isOnload && (
            <WrappedComponent<ICProps> route={route} params={params} />
          )}
        </div>
      </>
    );
  }) as any;
};
