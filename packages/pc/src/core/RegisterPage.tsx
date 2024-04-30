import CreatePage, { type IPageConfig } from './CreatePage';

export default (pageConfig: IPageConfig) => (WrappedComponent: any) => {
  return CreatePage(pageConfig, WrappedComponent) as any;
};
