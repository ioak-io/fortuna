import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ListExpense from './ListExpense';
import './style.scss';

interface Props {
  history: any;
}

const ExpensePage = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);

  return (
    <div className="expense-page">
      <div className="expense-page__topbar">
        <div className="expense-page__topbar__left">left</div>
        <div className="expense-page__topbar__right">right</div>
      </div>
      <div className="expense-page__main">
        <ListExpense />
      </div>
    </div>
  );
};

export default ExpensePage;
