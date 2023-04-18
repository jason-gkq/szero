import { history } from './history';
import { useEnv } from '@szero/hooks';

const {
  layout: { index },
  appName,
} = useEnv();

class configureNavigate {
  indexPage: string;

  constructor() {
    this.indexPage = appName
      ? `/${appName}${index || '/index'}`
      : `${index || '/index'}`;

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
      (appName && (pathname === `/${appName}` || pathname === `/${appName}/`))
    ) {
      pathname = this.indexPage;
      history.push(pathname);
    }
    return;
  };

  goTo = (
    url?: string,
    payload?: Record<string, any> | null,
    options?: { target?: string }
  ) => {
    url = url || this.indexPage;
    if (String(url).startsWith(`/`)) {
      if (appName && !String(url).startsWith(`/${appName}`)) {
        url = `/${appName}${url}`;
      }
      if (options && options.target) {
        window.open(
          `${window.location.protocol}//${window.location.host}${url}`,
          options.target,
          ''
        );
        return;
      }
      history.push(url, payload);
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
      history.go(delta);
      return;
    }
    history.back();
    return;
  };

  redirect = (url?: string, payload?: Record<string, any> | null) => {
    url = url || this.indexPage;
    if (String(url).startsWith(`/`)) {
      if (appName && !String(url).startsWith(`/${appName}`)) {
        url = `/${appName}${url}`;
      }
      history.replace(url, payload);
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
    if (url && appName && !String(url).startsWith(`/${appName}`)) {
      url = `/${appName}${url}`;
    }
    window.location.replace(url || window.location.href);
    return;
  };
}

export default new configureNavigate();
