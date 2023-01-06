import AddSpinnerCommand from '../../../events/AddSpinnerCommand';
import RemoveSpinnerCommand from '../../../events/RemoveSpinnerCommand';
import { newId } from '../../../events/MessageService';
/* eslint-disable import/prefer-default-export */
import { httpGet, httpPut } from '../../Lib/RestTemplate';

export const getAccount = (space: string, authorization: any) => {
  const taskId = newId();
  AddSpinnerCommand.next(taskId);
  return httpGet(`/account/${space}`, {
    headers: {
      Authorization: authorization.access_token,
    },
  })
    .then((response) => {
      RemoveSpinnerCommand.next(taskId);
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
      return Promise.resolve([]);
    })
    .catch((error) => {
      RemoveSpinnerCommand.next(taskId);
      return Promise.resolve([]);
    });
};

export const saveAccount = (
  space: string,
  payload: any,
  authorization: any
) => {
  const taskId = newId();
  AddSpinnerCommand.next(taskId);
  return httpPut(`/account/${space}`, payload, {
    headers: {
      Authorization: authorization.access_token,
    },
  })
    .then((response) => {
      RemoveSpinnerCommand.next(taskId);
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
    })
    .catch((error) => {
      RemoveSpinnerCommand.next(taskId);
      return Promise.resolve([]);
    });
};

export const getAccountScope = (space: string, authorization: any) => {
  const taskId = newId();
  AddSpinnerCommand.next(taskId);
  return httpGet(`/account/scope/${space}`, {
    headers: {
      Authorization: authorization.access_token,
    },
  })
    .then((response) => {
      RemoveSpinnerCommand.next(taskId);
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
      return Promise.resolve({});
    })
    .catch((error) => {
      RemoveSpinnerCommand.next(taskId);
      return Promise.resolve({});
    });
};

export const saveAccountScope = (
  space: string,
  payload: any,
  authorization: any
) => {
  const taskId = newId();
  AddSpinnerCommand.next(taskId);
  return httpPut(`/account/scope/${space}`, payload, {
    headers: {
      Authorization: authorization.access_token,
    },
  })
    .then((response) => {
      RemoveSpinnerCommand.next(taskId);
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
    })
    .catch((error) => {
      RemoveSpinnerCommand.next(taskId);
      return Promise.resolve({});
    });
};
