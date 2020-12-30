import { RELOAD_DOMAINS } from '../actions/types';

const initialState = {
  domains: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RELOAD_DOMAINS:
      console.log('RELOAD_DOMAINS reducer');
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
