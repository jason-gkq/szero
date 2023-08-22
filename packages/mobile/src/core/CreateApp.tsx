import './initApp';
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
import { paramToObject } from '@szero/utils';
import RoutesComponent from './RoutesComponent';
import useGlobalError from './useGlobalError';
import zhCN from 'antd-mobile/es/locales/zh-CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import '../style/index.less';
import { pageStore, rootStore } from '../store';
import NiceNavBar from './NiceNavBar';
import NiceTabBar from './NiceTabBar';

export interface IAppStore {
  appStatus: 'loading' | 'success' | 'finish';
  errorInfo: Record<string, any> | null | undefined;
  onLaunch?(options: Record<string, any>): void;
  onHide?(): void;
}

dayjs.locale('zh-cn');
const { pathname, state, search } = history.location;
const route = pathname;
const params = paramToObject(search, state);

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
            const { errorInfo = {} } = appStore;
            const { renderChildren, ...restErrorInfo } = errorInfo || {};
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
      [appStore.appStatus]
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
        </div>
        <div style={{ background: '#f5f5f5' }}>
          <SafeArea position='bottom' />
        </div>
      </ConfigProvider>
    );
  });
};

export default createApp;
