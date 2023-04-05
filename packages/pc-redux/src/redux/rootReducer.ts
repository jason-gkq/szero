import { handleActions } from 'redux-actions';
import staticActions from './rootAction';

const page = handleActions(
  {
    [(staticActions as any).page.currentPage](state, { payload }) {
      return {
        ...state,
        currentPage: { ...payload },
      };
    },
  },
  {}
);

const modalReducer = (state = { hiding: {} }, action: any) => {
  switch (action.type) {
    case 'nice-modal/show':
      return {
        ...state,
        [action.payload.modalId]: action.payload.args || true,
        hiding: {
          ...state.hiding,
          [action.payload.modalId]: false,
        },
      };
    case 'nice-modal/hide':
      return action.payload.force
        ? {
            ...state,
            [action.payload.modalId]: false,
            hiding: { [action.payload.modalId]: false },
          }
        : { ...state, hiding: { [action.payload.modalId]: true } };
    default:
      return state;
  }
};

export default {
  page,
  modalReducer,
};
