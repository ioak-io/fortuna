import { RELOAD_CUSTOM_ENDPOINTS } from '../actions/types';

const initialState = {
  customEndpoints: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RELOAD_CUSTOM_ENDPOINTS:
      console.log('RELOAD_CUSTOM_ENDPOINTS reducer');
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
