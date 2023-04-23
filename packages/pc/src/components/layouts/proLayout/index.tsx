import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import type { ProSettings, MenuDataItem } from '@ant-design/pro-components';
import { SettingDrawer, ProLayout } from '@ant-design/pro-components';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { navigate } from '@szero/navigate';
import { useEnv } from '@szero/hooks';
import RoutesTab from '../RoutesTab';
import { rootStore } from '../../../store';
import CustomBoundary from './CustomBoundary';

export interface IMenuProps {
  icon?: string;
  children?: IMenuProps[];
  path: string;
  redirect?: string;
  hideInMenu?: boolean;
  name?: string;
}

const menusFormat = (
  routes: MenuDataItem[],
  appName: string | undefined | null,
  lavel: number
) => {
  const newRoutes: MenuDataItem[] = [];
  for (let i = 0; i < routes.length; i++) {
    // 如果配置了 hideInMenu 则认为是菜单，为了过滤配置文件中非菜单选项
    if (!Reflect.has(routes[i], 'hideInMenu')) {
      continue;
    }
    const { icon, children, path, redirect, ...restItme } = routes[i];

    let ICON;
    if (icon && icon != '#' && [1, 2].includes(lavel)) {
      ICON = require(`@ant-design/icons`)[String(icon)];
    }
    let newPath = String(path);
    if (lavel === 1 && !newPath.startsWith('http')) {
      /**
       * 第一级路由必须以 / 开头
       * 如果设置了appName 则给一级菜单添加对应前缀
       */
      if (!newPath.startsWith(`/`)) {
        newPath = `/${newPath}`;
      }
      if (appName && !newPath.startsWith(`/${appName}`)) {
        newPath = `/${appName}${newPath}`;
      }
    }
    if (children && children.length > 0) {
      const childreRoutes = menusFormat(children, appName, lavel + 1);
      newRoutes.push({
        children: childreRoutes,
        icon: ICON && <ICON />,
        path: newPath,
        redirect,
        ...restItme,
      });
    } else {
      newRoutes.push({
        icon: ICON && <ICON />,
        path: newPath,
        redirect,
        ...restItme,
      });
    }
  }
  return newRoutes;
};

const getMenusTitle = (routes: MenuDataItem[], parentPath: string) => {
  const pathTitle: Record<string, string> = {};
  for (let i = 0; i < routes.length; i++) {
    const { children, path, name } = routes[i];
    if (children && children.length > 0) {
      Object.assign(
        pathTitle,
        getMenusTitle(children, `${parentPath}/${path}`)
      );
    } else {
      pathTitle[`${parentPath}/${path}`] = name || '';
    }
  }
  return pathTitle;
};

const treeIterator = (tree: any[]) => {
  const arr: any[] = [];
  if (!Array.isArray(tree) || !tree.length) return arr;
  tree.forEach((e: any) => {
    const index = arr.findIndex((i) => i.path == e.path);
    if (e.children) {
      if (index > -1) {
        arr[index] = {
          ...e,
          ...arr[index],
          children: treeIterator([
            ...(arr[index].children || []),
            ...(e.children || []),
          ]),
        };
      } else {
        arr.push({ ...e, children: treeIterator(e.children) });
      }
    } else {
      if (index < 0) {
        arr.push({ ...e });
      } else {
        arr[index] = { ...e, ...arr[index] };
      }
    }
  });

  return arr;
};
const { route = {}, appName, routes: configRoutes = [] } = useEnv();
const localRoutes: IMenuProps[] = [{ path: appName, children: configRoutes }];

const { showRoutesTab } = route || {};

export default observer(() => {
  const layout = toJS(rootStore.appStore.layout);
  const routes = toJS(rootStore.appStore.routes);

  const location = useLocation();

  const [menus, setMenus] = useState<MenuDataItem[]>([]);
  const [menusTitle, setMenusTitle] = useState<Record<string, string>>({});
  const [pathname, setPathname] = useState(location.pathname);
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    // fixSiderbar: true,
    fixSiderbar: true,
    fixedHeader: true,
    navTheme: 'light',
    layout: 'mix',
    contentWidth: 'Fluid',
    splitMenus: true,
  });
  useEffect(() => {
    const newRoutes = treeIterator(routes.concat(localRoutes));
    const routeToMenu: MenuDataItem[] = newRoutes.reduce(
      (accumulator, currentValue) => {
        const { path, children } = currentValue;
        return accumulator.concat(menusFormat(children, path, 1));
      },
      []
    );
    setMenus(routeToMenu);
    setMenusTitle(getMenusTitle(newRoutes, ''));
  }, [JSON.stringify(routes), JSON.stringify(configRoutes)]);

  useEffect(() => {
    setPathname(location.pathname);
  }, [location.pathname]);

  return (
    <div
      id={`${appName}-pro-layout`}
      style={{
        height: '100vh',
        overflowX: 'hidden',
      }}
    >
      <ProLayout
        token={{
          header: {
            heightLayoutHeader: 48, // header 高度
          },
          sider: {
            colorMenuBackground: '#fff', // menu 的背景颜色
            colorMenuItemDivider: '#dfdfdf', // menuItem 分割线的颜色
            colorTextMenu: '#595959', // menuItem 的字体颜色
            colorTextMenuSelected: 'rgba(42,122,251,1)', //menuItem 的选中字体颜色
            colorBgMenuItemSelected: 'rgba(230,243,254,1)', //menuItem 的选中背景颜色	 旧版：#1890ff 新版：rgba(230,243,254,1)
            colorBgMenuItemHover: 'rgba(230,243,254,1)',
          },
          pageContainer: {
            paddingBlockPageContainerContent: 10,
            paddingInlinePageContainerContent: 10,
          },
        }}
        ErrorBoundary={CustomBoundary}
        locale='zh-CN'
        location={{ pathname: pathname }}
        menuDataRender={() => menus}
        menuItemRender={(item: any, dom) => (
          <a
            onClick={() => {
              if (item.redirect && item.redirect.startsWith('/')) {
                navigate.goTo(item.redirect);
              } else {
                navigate.goTo(item.path);
              }
            }}
          >
            {dom}
          </a>
        )}
        {...settings}
        {...layout}
      >
        {useMemo(() => {
          if (showRoutesTab && Object.keys(menusTitle).length > 0) {
            return <RoutesTab menusTitle={menusTitle} />;
          }
          return;
        }, [showRoutesTab, menusTitle])}
        <Outlet />
      </ProLayout>
      {process.env.NODE_ENV === 'development' && (
        <SettingDrawer
          pathname={pathname}
          enableDarkTheme
          getContainer={() => document.getElementById(`${appName}-pro-layout`)}
          settings={settings}
          onSettingChange={(changeSetting) => {
            setSetting(changeSetting);
          }}
          disableUrlParams
        />
      )}
    </div>
  );
});
