/* eslint-disable import/prefer-default-export */
import { FETCH_CATEGORY } from './types';
import { httpGet, httpPut } from '../components/Lib/RestTemplate';
import { sendMessage } from '../events/MessageService';
import constants from '../components/Constants';

const domain = 'user';

export const fetchAllCategories =
  (space: string, authorization: any) => (dispatch: any) => {
    console.log('****', space, authorization);
    httpGet(`/category/${space}`, {
      headers: {
        Authorization: authorization.access_token,
      },
    }).then((response) => {
      dispatch({
        type: FETCH_CATEGORY,
        payload: { categories: response.data },
      });
    });
  };
