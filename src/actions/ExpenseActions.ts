/* eslint-disable import/prefer-default-export */
import {
  EXPENSE_ITEMS_FETCH_AND_APPEND,
  EXPENSE_ITEMS_FETCH_AND_SET,
  EXPENSE_ITEMS_UPDATE_FILTER,
  EXPENSE_ITEMS_UPDATE_PAGINATION,
  FETCH_CATEGORY,
} from './types';
import { httpGet, httpPost, httpPut } from '../components/Lib/RestTemplate';

export const fetchAndSetExpenseItems =
  (space: string, authorization: any, payload: any) => (dispatch: any) => {
    _fetchExpenseItems(
      space,
      authorization,
      {
        ...payload,
        pagination: {
          pageNo: 0,
          pageSize: 20,
          hasMore: true,
          ...payload.pagination,
        },
      },
      dispatch,
      EXPENSE_ITEMS_FETCH_AND_SET
    );
  };

export const fetchAndAppendExpenseItems =
  (space: string, authorization: any, payload: any) => (dispatch: any) => {
    if (payload.pagination.hasMore) {
      _fetchExpenseItems(
        space,
        authorization,
        payload,
        dispatch,
        EXPENSE_ITEMS_FETCH_AND_APPEND
      );
    }
  };

const _fetchExpenseItems = (
  space: string,
  authorization: any,
  payload: any,
  dispatch: any,
  actionType: string
) => {
  console.log('****', space, authorization, payload);
  httpPost(`/expense/${space}/`, payload, {
    headers: {
      Authorization: authorization.access_token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        dispatch({
          type: actionType,
          payload: response.data.results,
        });
        dispatch({
          type: EXPENSE_ITEMS_UPDATE_PAGINATION,
          payload: {
            pageNo: response.data.pageNo,
            hasMore: response.data.hasMore,
          },
        });
        const { pagination = null, ...filter } = { ...payload };
        dispatch({
          type: EXPENSE_ITEMS_UPDATE_FILTER,
          payload: filter,
        });
      }
    })
    .catch((error) => {});
};
