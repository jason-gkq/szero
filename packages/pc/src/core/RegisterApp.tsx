import React from 'react';
import { ConfigProvider, Spin, Result } from 'antd';
import type { ResultProps } from 'antd';
import { runInAction, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { history } from '@szero/navigate';
import { paramToObject } from '@szero/utils';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

import { pageStore, rootStore } from '../store';
import RoutesComponent from './RoutesComponent';
import useGlobalError from './useGlobalError';

import { ModalContextComponent } from '../components/basic/NiceModal';

import '../style/index.less';

dayjs.locale('zh-cn');
const { pathname, state, search } = history.location;
const route = pathname;
const params = paramToObject(search, state);
/**
 * 1. 初始化store
 * 2. 初始化路由
 * 3. 初始化layout
 * 4. 定义项目入口
 * 5. 添加全局错误监听
 */
export default (appStore: any) => (WrappedComponent: any) => {
  runInAction(() => {
    rootStore.appStore = appStore;
    rootStore.pageStore = pageStore;
  });
  class RegisterComponent extends WrappedComponent {
    constructor(props: any) {
      super(props);
      useGlobalError();
      dayjs.locale('zh-cn');
      appStore.onLaunch && appStore.onLaunch({ route, params });
    }

    componentDidMount() {
      if (super.componentDidMount) {
        super.componentDidMount();
      }
    }

    componentWillUnmount() {
      appStore.onHide && appStore.onHide();
      if (super.componentWillUnmount) {
        super.componentWillUnmount();
      }
    }

    renderContent() {
      const appStatus = appStore.appStatus;
      const errorInfo: ResultProps = toJS(appStore.errorInfo);
      const routes = toJS(appStore.routes);

      switch (appStatus) {
        case 'loading':
          return (
            <div
              style={{
                height: '100vh',
              }}
            >
              <Spin size='large' />
            </div>
          );
        case 'error':
          return <Result {...(errorInfo || {})} />;
        default:
          return (
            <HistoryRouter history={history as any}>
              <RoutesComponent routes={routes} />
            </HistoryRouter>
          );
      }
    }

    render() {
      return (
        <ConfigProvider locale={zhCN}>
          <ModalContextComponent>{this.renderContent()}</ModalContextComponent>
        </ConfigProvider>
      );
    }
  }
  return observer(RegisterComponent as typeof WrappedComponent);
};
