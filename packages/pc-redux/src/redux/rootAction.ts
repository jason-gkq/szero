import { createActions } from 'redux-actions';

const staticActions = {
  PAGE: {
    CURRENT_PAGE: void 0,
  },
} as any;

export const globalActions = createActions(staticActions, {
  // prefix: "global",
  // namespace: ".",
});

export default globalActions;

export function injectGlobalActions(actions: any, name?: string) {
  if (name) {
    globalActions[name] = actions;
    return;
  }
  if (actions) {
    Object.keys(actions).forEach((key) => {
      if (!globalActions[key]) {
        globalActions[key] = actions[key];
      }
    });
  }
}
export function showModal(modalId: string, args: any) {
  return {
    type: 'nice-modal/show',
    payload: {
      modalId,
      args,
    },
  };
}

export function hideModal(modalId: string, force: any) {
  return {
    type: 'nice-modal/hide',
    payload: {
      modalId,
      force,
    },
  };
}
