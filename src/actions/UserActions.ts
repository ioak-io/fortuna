import { GET_USER, ADD_USER, FETCH_ALL_USERS } from './types';
import { httpGet, httpPut } from '../components/Lib/RestTemplate';
import { sendMessage } from '../events/MessageService';
import constants from '../components/Constants';

const domain = 'user';

export const getUser = () => (dispatch: any) => {
  dispatch({
    type: GET_USER,
  });
};

export const addUser = (data: any) => (dispatch: any) => {
  dispatch({
    type: ADD_USER,
    payload: data,
  });
};

export const fetchAllUsers = (tenant: string, authorization: any) => (
  dispatch: any
) => {
  httpGet(`${constants.API_URL_USER}/${tenant}/all`, {
    headers: {
      Authorization: authorization.token,
    },
  }).then((response) => {
    dispatch({
      type: FETCH_ALL_USERS,
      payload: { users: response.data.data },
    });
  });
};

export const saveUser = (tenant: string, authorization: any, payload: any) => (
  dispatch: any
) => {
  httpPut(`${constants.API_URL_USER}/${tenant}/`, payload, {
    headers: {
      Authorization: authorization.token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        sendMessage(domain, true, {
          action: payload.id ? 'updated' : 'created',
        });
        dispatch(fetchAllUsers(tenant, authorization));
      }
    })
    .catch((error) => {
      if (error.response.status === 401) {
        sendMessage('session expired');
      }
    });
};
