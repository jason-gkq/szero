import React, { useLayoutEffect, useMemo } from 'react';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { runInAction, toJS } from 'mobx';
import { ConfigProvider, Spin } from 'antd';
import { history } from '@szero/navigate';
import { paramToObject } from '@szero/utils';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useEnv } from '@szero/hooks';
import { pageStore, rootStore } from '../store';

import { Exception } from '../components';
import RoutesComponent from './RoutesComponent';
import useGlobalError from './useGlobalError';

import { ModalContextComponent } from '../components/basic/NiceModal';

import '../style/index.less';

dayjs.locale('zh-cn');

const { appName } = useEnv();
const { pathname, state, search } = history.location;
const route = appName ? String(pathname).replace(`/${appName}`, '') : pathname;
const params = paramToObject(search, state);

const createApp = (appStore: any) => {
  runInAction(() => {
    rootStore.appStore = appStore;
    rootStore.pageStore = pageStore;
  });
  return observer(() => {
    const errorInfo = toJS(appStore.errorInfo);
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
                }}
              >
                <Spin size='large' />
              </div>
            );
          case 'error':
            return <Exception {...errorInfo} />;
          default:
            return (
              <HistoryRouter history={history as any}>
                <RoutesComponent routes={routes} />
              </HistoryRouter>
            );
        }
      },
      [appStore.appStatus, JSON.stringify(routes), JSON.stringify(errorInfo)]
    );

    return (
      <ConfigProvider locale={zhCN}>
        <ModalContextComponent>{renderContent()}</ModalContextComponent>
      </ConfigProvider>
    );
  });
};

export default createApp;