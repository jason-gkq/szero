import React, {
  useCallback,
  useEffect,
  useState,
  useLayoutEffect,
} from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { runInAction, toJS } from 'mobx';
import { Spin, Skeleton, Result } from 'antd';
import { paramToObject } from '@szero/utils';
import { pageStore, rootStore } from '../store';

export interface IPageConfig {
  pageId: string;
  permissions?: string[];
  isNeedLogin?: boolean;
  pageStatus?: 'loading' | 'skeleton' | 'error' | 'success';
  [key: string]: any;
}

export interface ICProps {
  route: string;
  params?: any;
  [key: string]: any;
}

export default (pageConfig: IPageConfig, WrappedComponent: any) => {
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
          return <Spin />;
        case 'skeleton':
          return <Skeleton active />;
        default:
          return <Result {...(errorInfo || {})} />;
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
  });
};
