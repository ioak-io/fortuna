import { RELOAD_TEMPLATES } from '../actions/types';

const initialState = {
  templates: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RELOAD_TEMPLATES:
      console.log('RELOAD_TEMPLATES reducer');
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
