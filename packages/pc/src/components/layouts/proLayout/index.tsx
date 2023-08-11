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
import { ZeroIcon, CustomBoundary } from '../../basic';

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
      ICON = <ZeroIcon type={icon as string} />;
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
        icon: ICON || <></>,
        path: newPath,
        redirect,
        ...restItme,
      });
    } else {
      newRoutes.push({
        icon: ICON || <></>,
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
    const newPath = path?.startsWith('/')
      ? `${parentPath}${path}`
      : `${parentPath}/${path}`;
    if (children && children.length > 0) {
      Object.assign(pathTitle, getMenusTitle(children, newPath));
    } else {
      pathTitle[newPath] = name || '';
    }
  }
  return pathTitle;
};

const {
  appName,
  route: { showRoutesTab },
} = useEnv();

export default observer(({ routesData }: { routesData: IMenuProps[] }) => {
  const layout = toJS(rootStore.appStore.layout);

  const location = useLocation();

  const [menus, setMenus] = useState<MenuDataItem[]>([]);
  const [menusTitle, setMenusTitle] = useState<Record<string, string>>({});
  const [pathname, setPathname] = useState(location.pathname);
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
    fixedHeader: true,
    navTheme: 'light',
    // layout: 'mix',
    // contentWidth: 'Fluid',
    // splitMenus: true,
  });
  useEffect(() => {
    const routeToMenu: MenuDataItem[] = routesData.reduce(
      (accumulator, currentValue) => {
        const { path, children } = currentValue;
        return accumulator.concat(menusFormat(children, path, 1));
      },
      []
    );
    setMenus(routeToMenu);
    setMenusTitle(getMenusTitle(routesData, ''));
  }, [JSON.stringify(routesData)]);

  useEffect(() => {
    setPathname(location.pathname);
  }, [location.pathname]);

  return (
    <div
      id={`${appName}-pro-layout`}
      style={{
        height: '100vh',
        minWidth: '1210px',
        overflowX: 'auto',
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
        menuItemRender={(item: any, dom: any) => (
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
          if (
            !layout.pure &&
            showRoutesTab &&
            Object.keys(menusTitle).length > 0
          ) {
            return <RoutesTab menusTitle={menusTitle} />;
          }
          return;
        }, [layout.pure, menusTitle])}
        <Outlet />
      </ProLayout>
      {process.env.NODE_ENV === 'development' && (
        <SettingDrawer
          pathname={pathname}
          enableDarkTheme
          getContainer={() => document.getElementById(`${appName}-pro-layout`)}
          settings={settings}
          onSettingChange={(changeSetting: any) => {
            setSetting(changeSetting);
          }}
          disableUrlParams
        />
      )}
    </div>
  );
});
