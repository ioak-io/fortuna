import { RELOAD_PROJECTS } from '../actions/types';

const initialState = {
  projects: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RELOAD_PROJECTS:
      console.log('RELOAD_PROJECTS reducer');
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
