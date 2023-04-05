import React from 'react';
import { NavBar } from 'antd-mobile';
import { toJS } from 'mobx';
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
  const storeNavBar = toJS(pageStore.navBar);
  const navBar = !!storeNavBar
    ? Object.assign(
        {
          title: layout.title,
          onBack: () => navigate.goBack(),
        },
        storeNavBar
      )
    : { title: layout.title, onBack: () => navigate.goBack() };

  const { title, style, backArrow, ...restNavBar } = navBar as INavBarInfo;
  document.title = String(title);
  const niceBackArrow = Reflect.has(navBar, 'backArrow')
    ? backArrow
    : !pageStore.isTabBar;
  const isShowBar = isInBrowser() ? !!storeNavBar : false;

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
