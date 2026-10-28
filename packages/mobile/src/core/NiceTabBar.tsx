import React from 'react';
import { TabBar } from 'antd-mobile';
import { observer } from 'mobx-react-lite';
import { navigate } from '@szero/navigate';

export default observer(({ appStore, pageStore, tabs }: any) => {
  let isShowBar = false;
  if ('isShowTabBar' in appStore && 'isShowTabBar' in pageStore) {
    if(pageStore.isShowTabBar && appStore.isShowTabBar){
      isShowBar = pageStore.isTabBar;
    } else if (!pageStore.isShowTabBar && appStore.isShowTabBar){
      isShowBar = false;
    } else if (pageStore.isShowTabBar && !appStore.isShowTabBar){
      isShowBar = pageStore.isTabBar;
    }else {
      isShowBar = false;
    }
  } else if ('isShowTabBar' in appStore && 'isShowTabBar' in pageStore == false) {
    isShowBar = appStore.isShowTabBar ? pageStore.isTabBar : false;
  } else if ('isShowTabBar' in appStore == false && 'isShowTabBar' in pageStore) {
    isShowBar = pageStore.isShowTabBar ? pageStore.isTabBar : false;
  } else {
    isShowBar = false;
  }

  const pageBody = document.querySelector('.page-body');
  if (isShowBar) {
    pageBody && pageBody.classList.add('page-bottom-margin');
  } else {
    pageBody && pageBody.classList.remove('page-bottom-margin');
  }

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
