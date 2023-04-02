import { observable, observe, spy } from "mobx";

let appStore: any;
// import("@/src/app.store").then((...e) => {
//   console.log(e);
// });

export class AppStore {
  constructor() {}
}

export const injectExtends = (extendsStore: any) => {
  // spy((event: any) => {
  // console.log("--------->>>>>",  event.object);

  // if (event.type === "action") {
  //   console.log(`${event.name} with args: ${event.arguments}`);
  // }
  // });
  const disposer = observe(extendsStore, (change: any) => {
    console.log(
      change.type,
      change.name,
      "from",
      change.oldValue,
      "to",
      change.object[change.name]
    );
  });
  // B 的实例继承 A 的实例
  // Object.setPrototypeOf(AppStore.prototype, extendsStore.prototype);

  // B 继承 A 的静态属性
  // Object.setPrototypeOf(AppStore, extendsStore);
  // appStore = new AppStore();
};

export const getAppStore = () => {
  return appStore;
};
// const appStore = new AppStore();
// export default appStore;
export default (function () {
  getAppStore();
})();
