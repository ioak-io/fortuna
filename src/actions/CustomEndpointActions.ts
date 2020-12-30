/* eslint-disable import/prefer-default-export */
import { RELOAD_CUSTOM_ENDPOINTS } from './types';
import { httpGet } from '../components/Lib/RestTemplate';
import constants from '../components/Constants';

const domain = 'custom';

export const fetchAllCustomEndpoints = (space, authorization) => dispatch => {
  httpGet(`${constants.API_URL_ENDPOINT_CUSTOM}/${space}`, {
    headers: {
      Authorization: authorization.token,
    },
  }).then(response => {
    dispatch({
      type: RELOAD_CUSTOM_ENDPOINTS,
      payload: { customEndpoints: response.data.data },
    });
  });
};
