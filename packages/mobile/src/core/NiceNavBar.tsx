import React from 'react';
import { NavBar } from 'antd-mobile';
import { observer } from 'mobx-react-lite';
import { useEnv } from '@szero/hooks';
import { navigate } from '@szero/navigate';
import type { INavBarInfo } from '../store';
import { isInBrowser } from '@szero/utils';
const { layout } = useEnv();

type IProps = {
  pageStore: any;
};

export default observer(({ pageStore }: IProps) => {
  const navBar = !!pageStore.navBar
    ? Object.assign(
        {
          title: layout.title,
          onBack: () => navigate.goBack(),
        },
        pageStore.navBar
      )
    : { title: layout.title, onBack: () => navigate.goBack() };

  const { title, style, backArrow, ...restNavBar } = navBar as INavBarInfo;
  const niceBackArrow = Reflect.has(navBar, 'backArrow')
    ? backArrow
    : !pageStore.isTabBar;

  document.title = navBar.title;
  const isShowBar = isInBrowser() ? !!pageStore.navBar : false;

  return (
    <>
      {isShowBar && (
        <div className='page-top'>
          <NavBar {...restNavBar} backArrow={niceBackArrow}>
            {navBar.title}
          </NavBar>
        </div>
      )}
    </>
  );
});
