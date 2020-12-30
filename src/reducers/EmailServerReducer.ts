import { RELOAD_EMAIL_SERVERS } from '../actions/types';

const initialState = {
  emailServers: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RELOAD_EMAIL_SERVERS:
      console.log('RELOAD_EMAIL_SERVERS reducer');
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
