import { type BrowserHistory, type HashHistory } from 'history';

/**
 * @description 页面跳转管理器
 * BrowserHistory 浏览器路由 /page1
 * HashHistory Hash路由 /#/page1
 */
export type History = BrowserHistory | HashHistory;
type Payload = Record<string, any>;
type Options = { target?: string };

export class ConfigureNavigate {
  /**
   * @description 首页路径
   */
  indexPage: string;
  /**
   * @description 路由管理器
   */
  history: History;
  /**
   * @description 项目根路径
   */
  rootRoute?: string;

  constructor(history: History, rootRoute?: string, index?: string) {
    this.history = history;
    this.rootRoute = rootRoute;
    this.indexPage = this.getUrl(index || '/index');
  }
  /**
   * 项目初始化后，如果当前路径是根路径，则跳转到首页
   */
  popIndex = (): void => {
    const { pathname } = this.history.location;
    if (
      pathname === '/' ||
      (this.rootRoute &&
        (pathname === `/${this.rootRoute}` ||
          pathname === `/${this.rootRoute}/`))
    ) {
      this.history.push(this.indexPage);
    }
  };

  /**
   * @description 获取完整的url
   * @param url
   * @returns
   * @example
   * ```tsx
   * // 获取首页完整路径
   * navigate.getUrl();
   * // 获取指定页面完整路径
   * navigate.getUrl('/page1');
   * ```
   */
  getUrl = (url: string): string => {
    if (this.rootRoute && !String(url).startsWith(`/${this.rootRoute}`)) {
      url = `/${this.rootRoute}${url}`;
    }
    return url;
  };

  /**
   * @description 跳转到指定页面
   * @param url 页面路径
   * @param payload 页面参数
   * @param options 跳转选项
   * @returns
   * @example
   * ```tsx
   * // 跳转到首页
   * navigate.goTo();
   * // 跳转到指定页面
   * navigate.goTo('/page1');
   * // 跳转到指定页面，并带上参数
   * navigate.goTo('/page1', { id: 1 });
   * // 跳转到指定页面，并指定打开方式
   * navigate.goTo('/page1', { id: 1 }, { target: '_blank' });
   * ```
   */
  goTo = (url?: string, payload?: Payload, options?: Options): void => {
    url = url || this.indexPage;
    if (url.startsWith(`/`)) {
      url = this.getUrl(url);
      if (options?.target) {
        window.open(
          `${window.location.protocol}//${window.location.host}${url}`,
          options.target,
          ''
        );
      } else {
        this.history.push(url, payload);
      }
    } else if (url.startsWith('https:') || url.startsWith('http:')) {
      console.info(`${url}`, '站外跳转');
      window.open(url, options?.target || '_self', '');
    } else {
      console.warn(`${url} 不符合规则，无法进行跳转。`);
    }
  };

  /**
   * @description 后退页面
   * @param delta 后退的页面数
   * @returns
   * @example
   * ```tsx
   * // 后退一页
   * navigate.goBack();
   * // 后退两页
   * navigate.goBack(2);
   * ```
   */
  goBack = (delta?: number): void => {
    if (delta !== undefined) {
      this.history.go(delta);
    } else {
      this.history.back();
    }
  };

  /**
   * @description 重定向页面
   * @param url 重定向的页面路径
   * @param payload 重定向的页面参数
   * @returns
   * @example
   * ```tsx
   * // 重定向到首页
   * navigate.redirect();
   * // 重定向到指定页面
   * navigate.redirect('/page1');
   * // 重定向到指定页面，并带上参数
   * navigate.redirect('/page1', { id: 1 });
   * ```
   */
  redirect = (url?: string, payload?: Payload): void => {
    url = url || this.indexPage;
    if (url.startsWith(`/`)) {
      url = this.getUrl(url);
      this.history.replace(url, payload);
    } else if (url.startsWith('https:') || url.startsWith('http:')) {
      console.info('站外跳转', `${url}`);
      window.location.replace(url);
    } else {
      console.warn(`${url} 不符合规则，无法进行跳转。`);
    }
  };

  /**
   * @description 刷新页面
   * @param url 刷新页面的路径
   * @returns
   * @example
   * ```tsx
   * // 刷新当前页面
   * navigate.reload();
   * // 刷新指定页面
   * navigate.reload('/page1');
   * ```
   */
  reload = (url?: string): void => {
    if (!url) {
      window.location.reload();
    } else if (url.startsWith('https:') || url.startsWith('http:')) {
      window.location.replace(url || window.location.href);
    } else {
      url = this.getUrl(url);
      window.location.replace(url || window.location.href);
    }
  };
}
