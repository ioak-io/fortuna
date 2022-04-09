import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAndSetExpenseItems } from '../actions/ExpenseActions';

interface Props {
  space: any;
}
const ExpenseStateActions = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);
  const expenseState: any = useSelector((state: any) => state.expense);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authorization?.isAuth && props.space) {
      dispatch(
        fetchAndSetExpenseItems(props.space, authorization, {
          ...expenseState.filter,
          pagination: expenseState.pagination,
        })
      );
    }
  }, [authorization, props.space]);

  return <></>;
};

export default ExpenseStateActions;
