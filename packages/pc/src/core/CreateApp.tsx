import './initApp';
import React, { useLayoutEffect, useMemo } from 'react';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { runInAction, toJS } from 'mobx';
import { ConfigProvider, Spin, Result, App } from 'antd';
import type { ResultProps } from 'antd';
import {
  StyleProvider,
  legacyLogicalPropertiesTransformer,
} from '@ant-design/cssinjs';
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

export default (appStore: any) => {
  runInAction(() => {
    rootStore.appStore = appStore;
    rootStore.pageStore = pageStore;
  });
  return observer(() => {
    const errorInfo: ResultProps = toJS(appStore.errorInfo);
    const appStoreConfigProvider = toJS(appStore.ConfigProvider) || {};
    const routes = toJS(appStore.routes);
    useLayoutEffect(() => {
      useGlobalError();
      dayjs.locale('zh-cn');
      appStore.onLaunch({ route, params });
      return () => {
        appStore.onHide && appStore.onHide();
      };
    }, []);

    const renderContent = useMemo(
      () => () => {
        switch (appStore.appStatus) {
          case 'loading':
            return (
              <div
                style={{
                  height: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Spin size='large' />
              </div>
            );
          case 'error':
            return (
              <div
                style={{
                  height: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Result {...(errorInfo || {})} />
              </div>
            );
          default:
            return (
              <HistoryRouter history={history as any}>
                <RoutesComponent routes={routes} />
              </HistoryRouter>
            );
        }
      },
      [appStore.appStatus, JSON.stringify(routes)]
    );

    return (
      <ConfigProvider locale={zhCN} {...appStoreConfigProvider}>
        <App>
          <StyleProvider
            hashPriority='high'
            transformers={[legacyLogicalPropertiesTransformer]}
          >
            <ModalContextComponent>{renderContent()}</ModalContextComponent>
          </StyleProvider>
        </App>
      </ConfigProvider>
    );
  });
};
