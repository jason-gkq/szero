import React from 'react';
import { TabBar } from 'antd-mobile';
import { observer } from 'mobx-react-lite';
import { navigate } from '@szero/navigate';
import { isInBrowser } from '@szero/utils';
import { runInAction } from 'mobx';

export default observer(({ pageStore, tabs }: any) => {
  const isShowBar = isInBrowser() ? pageStore.isTabBar : false;
  const pageBody = document.querySelector('.page-body');
  if (isShowBar) {
    pageBody && pageBody.classList.add('page-bottom-margin');
  } else {
    pageBody && pageBody.classList.remove('page-bottom-margin');
  }
  runInAction(() => {
    pageStore.isShowTabBar = isShowBar;
  });
  return (
    <>
      {isShowBar && (
        <div className='page-bottom'>
          <TabBar
            activeKey={pageStore.route}
            onChange={(key) => navigate.goTo(key)}
          >
            {tabs.map((item: any) => (
              <TabBar.Item
                key={item.key}
                icon={item.icon}
                title={item.title}
                badge={item.badge}
              />
            ))}
          </TabBar>
        </div>
      )}
    </>
  );
});
