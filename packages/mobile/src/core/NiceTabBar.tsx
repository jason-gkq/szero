import React from 'react';
import { TabBar } from 'antd-mobile';
import { observer } from 'mobx-react-lite';
import { navigate } from '@szero/navigate';
import { isInBrowser } from '@szero/utils';

export default observer(({ pageStore, tabs }: any) => {
  const isShowBar = isInBrowser() ? pageStore.isTabBar : false;
  return (
    <>
      {isShowBar && (
        <div className='page-bottom'>
          <TabBar
            activeKey={pageStore.$route}
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
