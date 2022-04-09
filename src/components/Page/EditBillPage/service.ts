/* eslint-disable import/prefer-default-export */
import { httpGet, httpPut } from '../../Lib/RestTemplate';

export const getBillById = (space: string, id: string, authorization: any) => {
  return httpGet(`/bill/${space}/${id}`, {
    headers: {
      Authorization: authorization.access_token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
      return Promise.resolve({});
    })
    .catch((error) => {
      return Promise.resolve({});
    });
};

export const saveBill = (space: string, payload: any, authorization: any) => {
  return httpPut(`/bill/${space}/`, payload, {
    headers: {
      Authorization: authorization.access_token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
    })
    .catch((error) => {
      return Promise.resolve({});
    });
};
