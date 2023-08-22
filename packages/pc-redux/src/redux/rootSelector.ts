export const getState = (state: any) => state || {};

export const globalSelectors: any = {
  getState,
};

export function injectGlobalSelectors(selectors: any, name?: string) {
  if (name) {
    globalSelectors[name] = selectors;
    return;
  }
  if (selectors) {
    Object.keys(selectors).forEach((key) => {
      if (!globalSelectors[key]) {
        globalSelectors[key] = selectors[key];
      }
    });
  }
}

export default globalSelectors;
