export class ConfigureNavigate {
  indexPage: string;
  history: any;
  rootRoute?: string;

  constructor(history: any, rootRoute?: string, index?: string) {
    this.history = history;
    this.rootRoute = rootRoute;
    this.indexPage = this.getUrl(index || '/index');
    this.initHistory(history.location);
  }

  private initHistory = (location: {
    pathname: string;
    search: any;
    state: any;
  }) => {
    if (!location) {
      return;
    }
    let { pathname } = location;
    if (
      pathname === '/' ||
      (this.rootRoute &&
        (pathname === `/${this.rootRoute}` ||
          pathname === `/${this.rootRoute}/`))
    ) {
      pathname = this.indexPage;
      this.history.push(pathname);
      return;
    }
  };

  getUrl = (url: string) => {
    if (this.rootRoute && !String(url).startsWith(`/${this.rootRoute}`)) {
      url = `/${this.rootRoute}${url}`;
    }
    return url;
  };

  goTo = (
    url?: string,
    payload?: Record<string, any> | null,
    options?: { target?: string }
  ) => {
    url = url || this.indexPage;
    if (String(url).startsWith(`/`)) {
      url = this.getUrl(url);
      if (options && options.target) {
        window.open(
          `${window.location.protocol}//${window.location.host}${url}`,
          options.target,
          ''
        );
        return;
      }
      this.history.push(url, payload);
      return;
    }
    if (String(url).startsWith('https:') || String(url).startsWith('http:')) {
      console.info(`${url}`, '站外跳转');
      window.open(url, (options && options.target) || '_self', '');
      return;
    }
    console.warn(`${url} 不符合规则，无法进行跳转。`);
    return;
  };

  goBack = (delta?: string | number) => {
    if (delta) {
      this.history.go(delta);
      return;
    }
    this.history.back();
    return;
  };

  redirect = (url?: string, payload?: Record<string, any> | null) => {
    url = url || this.indexPage;
    if (String(url).startsWith(`/`)) {
      url = this.getUrl(url);
      this.history.replace(url, payload);
      return;
    }

    if (String(url).startsWith('https:') || String(url).startsWith('http:')) {
      console.info('站外跳转', `${url}`);
      window.location.replace(url);
      return;
    }
    console.warn(`${url} 不符合规则，无法进行跳转。`);
    return;
  };

  reload = (url?: string) => {
    if (!url) {
      window.location.reload();
      return;
    }
    if (String(url).startsWith('https:') || String(url).startsWith('http:')) {
      window.location.replace(url || window.location.href);
      return;
    }
    url = this.getUrl(url);
    window.location.replace(url || window.location.href);
    return;
  };
}
