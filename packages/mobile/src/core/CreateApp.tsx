import React, { useMemo, useLayoutEffect } from 'react';
import {
  SafeArea,
  Mask,
  SpinLoading,
  ErrorBlock,
  ConfigProvider,
} from 'antd-mobile';
import { observer } from 'mobx-react-lite';
import { runInAction, toJS } from 'mobx';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { history } from '@szero/navigate';
import { useEnv } from '@szero/hooks';
import { paramToObject } from '@szero/utils';
import RoutesComponent from './RoutesComponent';
import useGlobalError from './useGlobalError';
import zhCN from 'antd-mobile/es/locales/zh-CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import '../style/index.less';
dayjs.locale('zh-cn');
import { pageStore, rootStore } from '../store';
import NiceNavBar from './NiceNavBar';
import NiceTabBar from './NiceTabBar';
export interface IAppConfig {
  isNeedLogin?: boolean;
}

export interface IAppStore {
  appStatus: 'loading' | 'success' | 'finish';
  errorInfo: Record<string, any> | null | undefined;
  onLaunch?(options: Record<string, any>): void;
  onHide?(): void;
}

const { appName } = useEnv();

const { pathname, state: payload, search } = history.location;
const $route = appName ? String(pathname).replace(`/${appName}`, '') : pathname;
const $payload = paramToObject(search, payload);

const createApp = (appStore: any) => {
  runInAction(() => {
    rootStore.appStore = appStore;
    rootStore.pageStore = pageStore;
  });
  return observer(() => {
    const tabs = toJS(appStore.tabs);
    useLayoutEffect(() => {
      useGlobalError();
      dayjs.locale('zh-cn');
      appStore.onLaunch({ $route, $payload });
      return () => {
        appStore.onHide && appStore.onHide();
      };
    }, []);
    const renderContent = useMemo(
      () => () => {
        switch (appStore.appStatus) {
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
          case 'error':
            const { renderChildren, ...restErrorInfo } =
              appStore.errorInfo || {};
            return (
              <ErrorBlock fullPage {...restErrorInfo}>
                {renderChildren && renderChildren()}
              </ErrorBlock>
            );
          default:
            return (
              <HistoryRouter history={history as any}>
                <RoutesComponent />
              </HistoryRouter>
            );
        }
      },
      [appStore.appStatus, history]
    );

    return (
      <ConfigProvider locale={zhCN}>
        <div className='page-container'>
          {useMemo(
            () => (
              <NiceNavBar pageStore={pageStore} />
            ),
            []
          )}
          {renderContent()}
          {useMemo(
            () => (
              <NiceTabBar tabs={tabs} pageStore={pageStore} />
            ),
            []
          )}
          <div style={{ background: '#ffcfac' }}>
            <SafeArea position='bottom' />
          </div>
        </div>
      </ConfigProvider>
    );
  });
};

export default createApp;
