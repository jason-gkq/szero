import { makeAutoObservable, autorun, runInAction } from 'mobx';
import { ReactElement, ReactNode } from 'react';
import rootStore from './root.store';

export interface INavBarInfo {
  back?: React.ReactNode | null;
  backArrow?: boolean | React.ReactNode;
  title?: string | React.ReactNode;
  left?: React.ReactNode;
  onBack?: () => void;
  right?: React.ReactNode;
  style?: CSSConditionRule;
}

// export interface INavBar
//  INavBarInfo | undefined | boolean | null
export type INavBar = INavBarInfo | undefined | boolean | null;

type IErrorInfo = {
  description?: ReactNode;
  title?: ReactNode;
  image?: string | ReactElement;
  status?: 'default' | 'disconnected' | 'empty' | 'busy';
  children?: ReactNode;
};

export interface PageLifeCycle {
  onLoad(options: Record<string, any>): void;
  onReady(): void;
  onShow(): void;
  onUnload(): void;
}

export interface PageLiveCycleListener {
  states: Array<{ lifeCycle: string; args: any[]; time: number }>;
  listeners: {
    [component: string]: {
      lifeCycle: Partial<PageLifeCycle>;
    };
  };
}

const INIT_LIFE_CYCLES = ['onLoad', 'onReady', 'onShow'];

// loading error tabs header
export class PageStore implements PageLifeCycle {
  private _route: string = '';
  private _payload: Record<string, any> | undefined | null;
  private _pageStatus: 'loading' | 'skeleton' | 'error' | 'success' = 'loading';
  private _navBar: INavBar;
  private lifeCycleListeners: { [page: string]: PageLiveCycleListener } = {};
  isTabBar: boolean = false;
  private _isShowFooter = false;
  private _errorInfo: IErrorInfo | undefined | null;

  constructor() {
    makeAutoObservable(this);
    autorun(() => {
      if (this._route) {
        runInAction(() => {
          this.isTabBar = !!rootStore.appStore.tabs.find(
            (item: any) => item.key === this._route
          );
        });
      }
    });
  }
  public setNavBar(info: INavBar) {
    this._navBar = Object.assign({}, this._navBar, info);
  }
  public setPageTitle(title: string | React.ReactNode) {
    this._navBar = Object.assign({}, this._navBar, { title });
  }

  public set navBar(newNavBar: INavBar) {
    this._navBar = newNavBar;
  }
  public get navBar() {
    return this._navBar;
  }
  public set errorInfo(newErrorInfo: IErrorInfo | undefined | null) {
    this._errorInfo = newErrorInfo;
  }
  public get errorInfo() {
    return this._errorInfo;
  }
  public set pageStatus(status: 'loading' | 'skeleton' | 'error' | 'success') {
    this._pageStatus = status;
  }
  public get pageStatus() {
    return this._pageStatus;
  }
  public set $route(route: string) {
    this._route = route;
  }
  public get $route() {
    return this._route;
  }
  public set $payload(params: any) {
    this._payload = params;
  }
  public get $payload() {
    return this._payload;
  }
  public set isShowFooter(flag: boolean) {
    this._isShowFooter = flag;
  }
  public get isShowFooter() {
    return this._isShowFooter;
  }
  /**
   * 页面渲染之前
   * @param options
   */
  public onLoad(options: Record<string, any>): void {
    console.log('pages onLoad', options);

    this.callCurrPageLifeCycle('onLoad', [options]);
  }
  public onReady(options?: Record<string, any>) {
    console.log('pages onReady', options);
    this.callCurrPageLifeCycle('onReady', [options]);
  }
  public onShow() {
    console.log('pages onShow');
    this.callCurrPageLifeCycle('onShow', []);
  }
  public onUnload(): void {
    console.log('pages onUnload');
    this.callCurrPageLifeCycle('onUnload', [this._route]);
    delete this.lifeCycleListeners[this._route];
  }

  public injectListener(component: string, lifeCycle: Partial<PageLifeCycle>) {
    if (!this._route) {
      throw new Error('clfe cycle current page not found');
    }
    if (!this.lifeCycleListeners[this._route]) {
      this.lifeCycleListeners[this._route] = {
        states: [],
        listeners: {},
      };
    }

    if (!this.lifeCycleListeners[this._route].listeners[component]) {
      this.lifeCycleListeners[this._route].listeners[component] = {
        lifeCycle: lifeCycle,
      };
    } else {
      this.lifeCycleListeners[this._route].listeners[component].lifeCycle =
        lifeCycle;
    }
    // 如果页面已经到了对应的启动状态，在设置的时候自动运行一次
    if (this.lifeCycleListeners[this._route].listeners[component].lifeCycle) {
      const currentListener = this.lifeCycleListeners[this._route];
      currentListener.states.forEach((state) => {
        if (INIT_LIFE_CYCLES.includes(state.lifeCycle)) {
          Object.keys(currentListener.listeners[component].lifeCycle).forEach(
            (key) => {
              if (state.lifeCycle === key) {
                this.callPageLifeCycleComponent(
                  this._route,
                  component,
                  state.lifeCycle as any,
                  state.args
                );
              }
            }
          );
        }
      });
    }
    const dispose = () => {
      if (
        this.lifeCycleListeners[this._route] &&
        this.lifeCycleListeners[this._route].listeners[component]
      ) {
        delete this.lifeCycleListeners[this._route].listeners[component];
      }
    };
    return dispose;
  }

  private callCurrPageLifeCycle(lifeCycle: keyof PageLifeCycle, args: any[]) {
    if (!this._route) {
      return;
    }
    if (!this.lifeCycleListeners[this._route]) {
      this.lifeCycleListeners[this._route] = {
        states: [],
        listeners: {},
      };
    }
    this.callPageLifeCycle(this._route, lifeCycle, args);
  }

  private pushCallState(
    page: string,
    lifeCycle: keyof PageLifeCycle,
    args: any[]
  ) {
    if (this.lifeCycleListeners[page].states) {
      const findItem = this.lifeCycleListeners[page].states.find((item) => {
        if (item.lifeCycle === lifeCycle) {
          item.args = args;
          return true;
        }
      });
      if (!findItem) {
        this.lifeCycleListeners[page].states.push({
          lifeCycle,
          args,
          time: Date.now(),
        });
      }
    }
  }

  private callPageLifeCycle(
    page: string,
    lifeCycle: keyof PageLifeCycle,
    args: any[]
  ) {
    if (!this.lifeCycleListeners[page]) {
      throw new Error(`callLifeCycle page "${page}" not found`);
    }
    this.pushCallState(page, lifeCycle, args);
    Object.keys(this.lifeCycleListeners[page].listeners).forEach((key) => {
      const liveCycleFn =
        this.lifeCycleListeners[page].listeners[key].lifeCycle &&
        this.lifeCycleListeners[page].listeners[key].lifeCycle[lifeCycle];
      if (liveCycleFn) {
        liveCycleFn.apply(this, args as any);
      }
    });
  }

  private callPageLifeCycleComponent(
    page: string,
    component: string,
    lifeCycle: keyof PageLifeCycle,
    args: any[]
  ) {
    if (!this.lifeCycleListeners[page]) {
      throw new Error(`callLifeCycle page "${page}" not found`);
    }
    this.pushCallState(page, lifeCycle, args);
    const componentListener =
      this.lifeCycleListeners[page].listeners[component];
    if (!componentListener) {
      throw new Error(
        `callLifeCycle page.component: "${page}.${component}" not found`
      );
    }
    const liveCycleFn = componentListener.lifeCycle[lifeCycle];
    if (liveCycleFn) {
      liveCycleFn.apply(this, args as any);
    }
  }
}

const pageStore = new PageStore();
export default pageStore;
