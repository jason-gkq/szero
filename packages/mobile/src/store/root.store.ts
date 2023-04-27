import { makeAutoObservable } from 'mobx';

class RootStore {
  pageStore: any;
  appStore: any;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}

const rootStore = new RootStore();

export default rootStore;
