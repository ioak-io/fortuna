import { GET_PROFILE, SET_PROFILE } from '../actions/types';
import { sendMessage } from '../events/MessageService';

const initialState = {
  theme: 'theme_dark',
  textSize: 'textsize_medium',
  themeColor: 'themecolor1',
  sidebar: true,
  hideSidebarOnDesktop: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PROFILE:
      console.log('GET_PROFILE reducer');
      return {
        ...state,
      };
    case SET_PROFILE:
      console.log('SET_PROFILE reducer');
      if (state.sidebar !== action.payload.sidebar) {
        sendMessage("sidebar-toggled", true);
      }
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
