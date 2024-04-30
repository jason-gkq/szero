import CreateApp from './CreateApp';

export default (appStore: any) => () => {
  return CreateApp(appStore);
};
