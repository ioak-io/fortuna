/* eslint-disable import/prefer-default-export */
import { RELOAD_DOMAINS } from './types';
import { httpGet } from '../components/Lib/RestTemplate';
import constants from '../components/Constants';

const domain = 'domain';

export const fetchAllDomains = (space, authorization) => dispatch => {
  httpGet(`${constants.API_URL_ENDPOINT_DOMAIN}/${space}`, {
    headers: {
      Authorization: authorization.token,
    },
  }).then(response => {
    dispatch({
      type: RELOAD_DOMAINS,
      payload: { domains: response.data.data },
    });
  });
};
