import React from 'react';
import { Spin, Skeleton } from 'antd';
import { observer } from 'mobx-react-lite';
import { runInAction, toJS } from 'mobx';
import { paramToObject } from '@szero/utils';
import { useEnv } from '@szero/hooks';
import { pageStore, rootStore } from '../store';
import { Exception } from '../components';

export interface IPageConfig {
  isNeedLogin?: boolean;
  pageId: string;
  permissions?: string[];
  pageStatus?: 'loading' | 'skeleton' | 'error' | 'success';
  [key: string]: any;
}

export interface ICProps {
  route: string;
  params?: any;
  [key: string]: any;
}
const { appName } = useEnv();

export default (pageConfig: IPageConfig) =>
  (WrappedComponent: typeof React.PureComponent) => {
    class BasePageComponent extends WrappedComponent<ICProps, any> {
      private isOnload = false;
      route: string;
      params: any;

      constructor(props: ICProps) {
        super(props);
        const { pathname, search } = window.location;
        const { usr: payload } = window.history.state;
        const route = appName
          ? String(pathname).replace(`/${appName}`, '')
          : pathname;
        const params = paramToObject(search, payload);
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
        this.setState({
          isOnload: !!isOnload,
          route,
          params,
        });
        /**
         * 前置执行 onLoad 方法；
         */
        pageStore.onLoad && pageStore.onLoad({ route, params });
      }

      componentWillUnmount(): void {
        pageStore.onUnload && pageStore.onUnload();
        if (super.componentWillUnmount) {
          super.componentWillUnmount();
        }
      }

      renderNoSucess() {
        const errorInfo = toJS(pageStore.errorInfo);
        switch (pageStore.pageStatus) {
          case 'loading':
            return <Spin />;
          case 'skeleton':
            return <Skeleton active />;
          default:
            return <Exception {...errorInfo} />;
        }
      }

      render() {
        return (
          <>
            {pageStore.pageStatus != 'success' && this.renderNoSucess()}
            <div
              style={{
                visibility:
                  pageStore.pageStatus == 'success' ? 'inherit' : 'hidden',
              }}
            >
              {this.isOnload && super.render()}
            </div>
          </>
        );
      }
    }

    return observer(BasePageComponent as any);
  };
