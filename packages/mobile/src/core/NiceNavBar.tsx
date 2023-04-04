import React, { useEffect } from 'react';
import { NavBar } from 'antd-mobile';
import { observer } from 'mobx-react-lite';
import { useEnv, useMergeState, useReactive } from '@szero/hooks';
import { navigate } from '@szero/navigate';
import type { INavBarInfo } from '../store';
import { isInBrowser } from '@szero/utils';
const { layout } = useEnv();

type IProps = {
  pageStore: any;
};

export default observer(({ pageStore }: IProps) => {
  const state = useReactive({
    navBar: { title: layout.title, onBack: () => navigate.goBack() },
    niceBackArrow: !pageStore.isTabBar,
  });

  useEffect(() => {
    if (!!pageStore.navBar) {
      state.navBar = Object.assign(
        {
          title: layout.title,
          onBack: () => navigate.goBack(),
        },
        pageStore.navBar
      );
    }
  }, [JSON.stringify(pageStore.navBar)]);

  const { title, style, backArrow, ...restNavBar } =
    state.navBar as INavBarInfo;
  document.title = String(title);
  const niceBackArrow = Reflect.has(state.navBar, 'backArrow')
    ? backArrow
    : !pageStore.isTabBar;
  const isShowBar = isInBrowser() ? !!pageStore.navBar : false;

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
