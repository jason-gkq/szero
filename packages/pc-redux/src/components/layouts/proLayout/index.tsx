import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import type { ProSettings, MenuDataItem } from '@ant-design/pro-components';
import { connect } from 'react-redux';
import { SettingDrawer, ProLayout } from '@ant-design/pro-components';
import { globalSelectors, globalActions } from '../../../redux';
import { useEnv } from '@szero/hooks';
import { navigate } from '@szero/navigate';
import { Avatar, Popover, Space, Button, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import RoutesTab from '../RoutesTab';

export interface IMenuProps {
  icon?: string;
  children?: IMenuProps[];
  path: string;
  redirect?: string;
  hideInMenu?: boolean;
  name?: string;
}

type IProps = {
  routes: IMenuProps[];
  logout: Function;
  layout: Record<string, any>;
};

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
    if (lavel === 1) {
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
const {
  layout: { settings: configSettings, token: configToken },
  route = {},
  appName,
  routes: configRoutes = [],
} = useEnv();

const { showRoutesTab } = route || {};

const Layout = (props: IProps) => {
  const { routes, logout, layout } = props;
  const location = useLocation();
  const [menus, setMenus] = useState<MenuDataItem[]>([]);
  const [menusTitle, setMenusTitle] = useState<Record<string, string>>({});
  const [pathname, setPathname] = useState(location.pathname);
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>(
    configSettings || {
      // fixSiderbar: true,
      fixSiderbar: true,
      fixedHeader: true,
      navTheme: 'light',
      layout: 'mix',
      contentWidth: 'Fluid',
      splitMenus: true,
    }
  );
  useEffect(() => {
    const newRoutes = treeIterator(routes.concat(configRoutes));
    setMenusTitle(getMenusTitle(newRoutes, ''));
    setMenus(menusFormat(newRoutes, appName, 1));
  }, [JSON.stringify(routes), JSON.stringify(configRoutes)]);

  useEffect(() => {
    setPathname(location.pathname);
  }, [location.pathname]);

  const handleLogout = useCallback(() => {
    Modal.confirm({
      title: '确定注销并退出系统吗?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        logout();
      },
    });
  }, []);

  return (
    <div
      id={`${appName}-pro-layout`}
      style={{
        height: '100vh',
        overflowX: 'hidden',
      }}
    >
      <ProLayout
        token={
          configToken || {
            header: {
              colorBgHeader: '#292f33', //header 的背景颜色	 #001529
              colorHeaderTitle: '#fff', // sider 的标题字体颜色
              colorTextMenu: 'rgba(255, 255, 255, 0.65)', // menuItem 的字体颜色	 #dfdfdf 旧版：rgba(255, 255, 255, 0.65)
              colorTextMenuSelected: '#fff', // menuItem 的选中字体颜色
              colorBgMenuItemHover: '#1890ff', // menuItem 的 hover 背景颜色
              colorBgMenuItemSelected: '#1890ff', //menuItem 的选中背景颜色	 #22272b
              // colorTextRightActionsItem: "#dfdfdf",
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
          }
        }
        // pure={true}
        title={layout.title}
        locale='zh-CN'
        logo={layout.Logo}
        location={{ pathname: pathname }}
        menuDataRender={() => menus}
        // contentStyle={{
        //   margin: "10px",
        // }}
        // headerContentRender={() => <ProBreadcrumb />}
        // breadcrumbRender={(routers = []) => [
        //   {
        //     path: "/",
        //     breadcrumbName: "首页",
        //   },
        //   ...routers,
        // ]}
        // ErrorBoundary={pathname === '/custom' ? CustomBoundary : undefined}
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
        rightContentRender={() => {
          const content = (
            <Space direction='vertical'>
              {layout &&
                layout.profile &&
                layout.profile.map((item: any) => item)}
              <Button
                size='small'
                key={'退出登录'}
                type='link'
                onClick={handleLogout}
              >
                退出登录
              </Button>
            </Space>
          );
          return (
            <Space direction='horizontal'>
              {layout &&
                layout.rightContent &&
                layout.rightContent.map((item: any) => item)}
              <Popover placement='bottomRight' content={content}>
                <Avatar
                  style={{ height: '90%' }}
                  shape='square'
                  size='large'
                  icon={<UserOutlined />}
                />
              </Popover>
            </Space>
          );
        }}
        {...settings}
      >
        {useMemo(() => {
          if (showRoutesTab && Object.keys(menusTitle).length > 0) {
            return <RoutesTab menusTitle={menusTitle} />;
          }
          return;
        }, [showRoutesTab, menusTitle])}
        {/* {showRoutesTab && Object.keys(menusTitle).length > 0 && (
          <RoutesTab menusTitle={menusTitle} />
        )} */}
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
};

export default connect(
  (state) => {
    const layout = globalSelectors.app.getLayout(state) || {};
    const routes = globalSelectors.app.getRoutes(state);
    return { routes, layout };
  },
  (dispatch) => {
    return {
      logout() {
        dispatch(
          (globalActions as any).app.logout({ actionType: 'userLogout' })
        );
      },
    };
  }
)(Layout);
