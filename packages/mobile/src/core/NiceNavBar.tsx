import React from 'react';
import { NavBar } from 'antd-mobile';
import { observer } from 'mobx-react-lite';
import { useEnv } from '@szero/hooks';
import { navigate } from '@szero/navigate';
import type { INavBarInfo } from '../store';
import { isInBrowser } from '@szero/utils';
import { toJS } from 'mobx';

const { layout } = useEnv();

type IProps = {
  pageStore: any;
};

export default observer(({ pageStore }: IProps) => {
  const { navBar } = toJS(pageStore) || {};
  const newNavBar = !!navBar
    ? Object.assign(
        {
          title: layout.title,
          onBack: () => navigate.goBack(),
        },
        navBar
      )
    : { title: layout.title, onBack: () => navigate.goBack() };

  const { title, style, backArrow, ...restNavBar } = newNavBar as INavBarInfo;
  document.title = String(title);
  const niceBackArrow = Reflect.has(newNavBar, 'backArrow')
    ? backArrow
    : !pageStore.isTabBar;
  const isShowBar = isInBrowser() ? !!navBar : false;

  return (
    <>
      {isShowBar && (
        <div className='page-top'>
          <NavBar {...restNavBar} backArrow={niceBackArrow}>
            {title}
          </NavBar>
        </div>
      )}
    </>
  );
});
