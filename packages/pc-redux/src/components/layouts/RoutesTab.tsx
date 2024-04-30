import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { navigate } from '@szero/navigate';
import { useEnv } from '@szero/hooks';
import { localStorage } from '@szero/cache';
import { Tabs, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const { appName, layout, route = {} } = useEnv();
const { routesHistoryLength } = route || {};
let { index: indexPage } = layout || {};

export default ({ menusTitle }: { menusTitle: Record<string, string> }) => {
  const [activeKey, setActiveKey] = useState(''); // defaultPanes[0].key
  const [items, setItems] = useState<any[]>([]);
  const location = useLocation();
  useEffect(() => {
    add(location);
  }, [location.pathname]);

  const add = useCallback(
    (location: any) => {
      const { pathname, ...restLocation } = location;
      const targetIndex = items.findIndex((pane) => pane.key === pathname);
      if (targetIndex >= 0) {
        items[targetIndex]['location'] = {
          pathname: pathname,
          ...restLocation,
        };
        setItems([...items]);
        routesHistoryLength && localStorage.set('routes-history', [...items]);
      } else if (menusTitle[pathname]) {
        const label = menusTitle[pathname] || '';

        let newItems = [
          ...items,
          {
            label,
            location: {
              pathname: pathname,
              ...restLocation,
            },
            key: pathname,
          },
        ];
        if (newItems.length == 1) {
          newItems[0]['closable'] = false;
        } else {
          newItems[0]['closable'] = true;
        }
        if (routesHistoryLength && newItems.length > routesHistoryLength) {
          newItems = newItems.slice(1);
        }
        setItems(newItems);
        routesHistoryLength && localStorage.set('routes-history', newItems);
      }
      setActiveKey(pathname);
    },
    [items]
  );

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
    const { location } = items.find((pane) => pane.key === newActiveKey);
    navigate.goTo(`${location.pathname}${location.search}`, location.state);
  };

  const remove = (targetKey: string) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey);
    const newPanes = items.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && targetKey === activeKey) {
      const { key, location } =
        newPanes[
          targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
        ];
      navigate.goTo(`${location.pathname}${location.search}`, location.state);
      setActiveKey(key);
    }
    if (newPanes.length == 1) {
      newPanes[0]['closable'] = false;
    } else {
      newPanes[0]['closable'] = true;
    }
    setItems(newPanes);
  };

  const closeAll = useCallback(() => {
    const { pathname } = location;
    if (indexPage && !indexPage.startsWith(`/${appName}`)) {
      indexPage = `/${appName}${indexPage}`;
    }
    if (pathname == indexPage) {
      closeOther();
    } else {
      setItems([]);
      setTimeout(() => {
        navigate.goTo(indexPage);
      });
    }
  }, [items, location]);

  const closeOther = useCallback(() => {
    const targetData = items.find((pane) => pane.key === activeKey);
    setItems([
      {
        closable: false,
        ...targetData,
      },
    ]);
  }, [items, activeKey]);
  const downItems: MenuProps['items'] = [
    {
      label: '关闭全部',
      key: 'closeAll',
      onClick: closeAll,
    },
    {
      type: 'divider',
    },
    {
      label: '关闭其他',
      key: 'closeOther',
      onClick: closeOther,
    },
  ];

  const onEdit = (targetKey: any, action: 'add' | 'remove') => {
    if (action === 'add') {
      // add();
    } else {
      remove(targetKey);
    }
  };
  return (
    <div>
      <Tabs
        hideAdd
        onChange={onChange}
        activeKey={activeKey}
        type='editable-card'
        style={{ height: 40 }}
        onEdit={onEdit}
        items={items}
        tabBarExtraContent={
          <Dropdown menu={{ items: downItems }}>
            <a
              style={{
                width: '40px',
                height: '40px',
                lineHeight: '40px',
                border: '1px solid #eee',
                display: 'block',
                textAlign: 'center',
              }}
              onClick={(e) => e.preventDefault()}
            >
              <DownOutlined />
            </a>
          </Dropdown>
        }
      />
    </div>
  );
};
