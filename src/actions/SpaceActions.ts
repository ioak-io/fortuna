/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { REFRESH_SPACES } from './types';

export const fetchAllSpaces = () => dispatch => {
  axios
    .get(`${process.env.REACT_APP_ONEAUTH_API_URL}/space/introspect`)
    .then(response => {
      console.log(response.data.data);
      dispatch({
        type: REFRESH_SPACES,
        payload: { spaces: response.data.data },
      });
    });
};
