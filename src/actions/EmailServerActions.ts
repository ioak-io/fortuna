/* eslint-disable import/prefer-default-export */
import { RELOAD_EMAIL_SERVERS } from './types';
import { httpGet } from '../components/Lib/RestTemplate';
import constants from '../components/Constants';

export const allEmailServers = (space, authorization) => dispatch => {
  httpGet(`${constants.API_URL_EMAIL_SERVER}/${space}`, {
    headers: {
      Authorization: authorization.token,
    },
  }).then(response => {
    dispatch({
      type: RELOAD_EMAIL_SERVERS,
      payload: { emailServers: response.data },
    });
  });
};
