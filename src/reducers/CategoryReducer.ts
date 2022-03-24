import { FETCH_CATEGORY } from '../actions/types';

const initialState = {
  categories: [],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case FETCH_CATEGORY:
      console.log('FETCH_CATEGORY reducer');
      console.log(action);
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
