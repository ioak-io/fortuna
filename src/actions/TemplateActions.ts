/* eslint-disable import/prefer-default-export */
import { RELOAD_TEMPLATES } from './types';
import { httpGet } from '../components/Lib/RestTemplate';
import constants from '../components/Constants';

export const allTemplates = (space, authorization) => dispatch => {
  httpGet(`${constants.API_URL_TEMPLATE}/${space}`, {
    headers: {
      Authorization: authorization.token,
    },
  }).then(response => {
    dispatch({
      type: RELOAD_TEMPLATES,
      payload: { templates: response.data },
    });
  });
};
