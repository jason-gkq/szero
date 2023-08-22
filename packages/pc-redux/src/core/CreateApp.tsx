import './initApp';
import React, { useMemo, useLayoutEffect } from 'react';
import { Provider } from 'react-redux';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { Result, Spin } from 'antd';
import { history } from '@szero/navigate';
import { store as $store } from '../redux';
import ContextComponent from './ConfigureContext';
import RoutesComponent from './RoutesComponent';
import useGlobalError from './useGlobalError';
import { paramToObject } from '@szero/utils';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useMergeState } from '@szero/hooks';
import type { IModel } from '../redux';
import '../style/index.less';
dayjs.locale('zh-cn');
export interface IAppConfig {
  isNeedLogin?: boolean;
}

const createApp = (appConfig: IAppConfig, appModel: IModel) => {
  return () => {
    const [state, setState] = useMergeState({
      appStatus: 'loading',
      errorInfo: {},
    });

    let { pathname: $route, state: payload, search } = history.location;
    const $payload = paramToObject(search, payload);

    const { appStatus, errorInfo } = state;
    useLayoutEffect(() => {
      useGlobalError();
      dayjs.locale('zh-cn');
      appModel.initialize && $store.dispatch(appModel.actions.initState());
      const unsubscribe = $store.subscribe(() => {
        const { app = {} } = $store.getState() || {};
        const { appStatus, errorInfo } = app;
        if (appStatus && appStatus !== 'loading') {
          setState({
            appStatus,
            errorInfo,
          });
        }
        if (appStatus && appStatus === 'finish') {
          unsubscribe();
        }
      });

      $store.dispatch(
        appModel.actions.onLunch({ $route, $payload, ...appConfig })
      );

      return () => {
        unsubscribe && unsubscribe();
      };
    }, []);
    const renderContent = useMemo(
      () => () => {
        switch (appStatus) {
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
                <RoutesComponent />
              </HistoryRouter>
            );
        }
      },
      [appStatus, JSON.stringify(errorInfo), history]
    );

    return (
      <Provider store={$store}>
        <ContextComponent locale={zhCN} appConfig={appConfig}>
          {renderContent()}
        </ContextComponent>
      </Provider>
    );
  };
};

export default createApp;
