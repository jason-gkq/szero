import { createBrowserHistory, createHashHistory } from 'history';
import { ConfigureNavigate } from './configureNavigate';
/**
 * @routeType 路由类型Browser 传统，Hash 哈希路由
 * @rootRoute 跟路由，配合publicPath使用，如果项目是模块化管理，则该参数为模块名称
 *    例如：模块名为admin，浏览器实际访问地址为：http://127.0.0.1/admin/index/index
 *      则路由跳转的时候为 navigate.goTo('/admin/index/index');
 *      如果设置该参数 则可以写为：navigate.goTo('/index/index');
 */
export type IRouteEnvironment = {
  routeType: 'Browser' | 'Hash';
  rootRoute?: string | undefined;
  index?: string | undefined;
};

let navigate: any;
let history: any;

export const initNavigate = (props: IRouteEnvironment) => {
  if (props.routeType == 'Hash') {
    history = createHashHistory({ window });
  } else {
    history = createBrowserHistory({ window });
  }
  navigate = new ConfigureNavigate(history, props.rootRoute, props.index);
  return { history, navigate };
};

export { navigate, history };
