import { makeAutoObservable } from 'mobx';

type IErrorInfo = {
  code?: number;
  msg?: string;
  url?: string;
  onClick?: Function;
};

export interface PageLifeCycle {
  onLoad(options: Record<string, any>): void;
  onReady(): void;
  onShow(): void;
  onUnload(): void;
}

// loading error tabs header
export class PageStore implements PageLifeCycle {
  route: string = '';
  params: any;
  pageStatus: 'loading' | 'skeleton' | 'error' | 'success' = 'loading';
  isShowFooter: boolean = false;
  errorInfo: IErrorInfo | undefined | null;

  constructor() {
    makeAutoObservable(this);
  }

  public setPageStatus(status: 'loading' | 'skeleton' | 'error' | 'success') {
    this.pageStatus = status;
  }
  public setIsShowFooter(flag: boolean) {
    this.isShowFooter = flag;
  }
  public setErrorInfo(newErrorInfo: IErrorInfo | undefined | null) {
    this.errorInfo = newErrorInfo;
  }

  /**
   * 页面渲染之前
   * @param options
   */
  public onLoad(options: Record<string, any>): void {
    console.log('pages onLoad', options);
  }
  public onReady(options?: Record<string, any>) {
    console.log('pages onReady', options);
  }
  public onShow() {
    console.log('pages onShow');
  }
  public onUnload(): void {
    console.log('pages onUnload');
  }
}

const pageStore = new PageStore();
export default pageStore;
