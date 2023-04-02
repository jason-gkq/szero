import { history } from "./history";
import { useEnv } from "@szero/hooks";

type IGoBack = {
  delta?: string | number;
  url?: string;
};

const {
  layout: { index },
  appName,
} = useEnv();

class configureNavigate {
  maxHistoryLength: number;
  indexPage: string;
  navigateHistory: Array<any> = [];

  constructor() {
    this.maxHistoryLength = 50;

    this.indexPage = appName
      ? `/${appName}${index || "/index"}`
      : `${index || "/index"}`;

    this.initHistory(history.location);
  }

  private initHistory = (location: {
    pathname: string;
    search: any;
    state: any;
  }) => {
    this.navigateHistory = [];
    if (!location) {
      return;
    }
    let { pathname, search } = location;
    if (
      pathname === "/" ||
      (appName && (pathname === `/${appName}` || pathname === `/${appName}/`))
    ) {
      pathname = this.indexPage;
      this.navigateHistory.push({ url: pathname });
      history.push(pathname);
    }
    if (search && search != "?") {
      pathname = search.includes("?")
        ? `${pathname}${search}`
        : `${pathname}?${search}`;
    }
    console.log("init-LLL", pathname);

    this.navigateHistory.push({ url: pathname });
    return;
  };

  goTo = (
    url?: string,
    payload?: Record<string, any> | null,
    options?: { replace?: boolean; target?: string }
  ) => {
    url = url || this.indexPage;
    if (String(url).startsWith(`/`)) {
      if (options && options.replace) {
        this.redirect(url, payload);
        return;
      }
      if (appName && !String(url).startsWith(`/${appName}`)) {
        url = `/${appName}${url}`;
      }
      if (options && options.target) {
        window.open(
          `${window.location.protocol}//${window.location.host}${url}`,
          options.target,
          ""
        );
        return;
      }
      if (this.navigateHistory.length >= this.maxHistoryLength) {
        this.navigateHistory = this.navigateHistory.slice(1);
      }
      this.navigateHistory.push({ url, payload });
      history.push(url, payload);
      return;
    }

    if (String(url).startsWith("https:") || String(url).startsWith("http:")) {
      console.info(`${url}`, "站外跳转");
      window.open(url, (options && options.target) || "_self", "");
      return;
    }
    console.warn(`${url} 不符合规则，无法进行跳转。`);
    return;
  };

  goBack = (payload?: IGoBack) => {
    // let { delta, url = "" } = payload as any;
    // if (!delta && !url) {
    //   this.history.back();
    //   this.navigateHistory = this.navigateHistory.slice(0, -1);
    //   return;
    // }

    // if (delta && delta < 0) {
    //   this.history.go(Number(delta));
    //   this.navigateHistory = this.navigateHistory.slice(0, Number(delta));
    //   return;
    // }

    // if (url) {
    //   const tempIndex = this.navigateHistory.findIndex((item) => {
    //     return item.pathname === url;
    //   });

    //   if (tempIndex >= 0) {
    //     this.navigateHistory = this.navigateHistory.slice(0, tempIndex + 1);
    //     delta = this.navigateHistory.length - tempIndex + 1;
    //     this.history.go(delta);
    //     return;
    //   } else {
    //     this.goTo({ url });
    //     return;
    //   }
    // }

    history.back();
    this.navigateHistory = this.navigateHistory.slice(0, -1);
    return;
  };

  redirect = (
    url?: string,
    payload?: Record<string, any> | null,
    options?: { isRedirect: boolean }
  ) => {
    url = url || this.indexPage;
    if (String(url).startsWith(`/`)) {
      if (appName && !String(url).startsWith(`/${appName}`)) {
        url = `/${appName}${url}`;
      }
      // if (options && options.isRedirect && !url.includes("redirect")) {
      //   const { url: redirect } =
      //     this.navigateHistory[this.navigateHistory.length - 1];
      //   url = appendParam(url, { redirect });
      // }
      // console.log("begin", this.navigateHistory);

      this.navigateHistory = this.navigateHistory.slice(0, -1);
      this.navigateHistory.push({ url, payload });
      history.replace(url, payload);
      // console.log("end", this.navigateHistory);
      return;
    }

    if (String(url).startsWith("https:") || String(url).startsWith("http:")) {
      console.info("站外跳转", `${url}`);
      window.location.replace(url);
      return;
    }
    console.warn(`${url} 不符合规则，无法进行跳转。`);
    return;
  };

  reload = (url?: string) => {
    url = url || this.indexPage;
    if (
      String(url).startsWith(`/`) &&
      appName &&
      !String(url).startsWith(`/${appName}`)
    ) {
      url = `/${appName}${url}`;
    }
    console.log(`${window.location.protocol}//${window.location.host}${url}`);

    window.location.replace(
      `${window.location.protocol}//${window.location.host}${url}`
    );
    return;
  };
}

export default new configureNavigate();
