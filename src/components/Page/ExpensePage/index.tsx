import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import OakButton from '../../../oakui/wc/OakButton';
import ListExpense from './ListExpense';
import './style.scss';

interface Props {
  history: any;
}

const ExpensePage = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);

  const [filterExpanded, setFilterExpanded] = useState(true);

  return (
    <div className="expense-page">
      <div className="expense-page__topbar">
        <div className="expense-page__topbar__left">left</div>
        <div className="expense-page__topbar__right">
          <OakButton
            handleClick={() => setFilterExpanded(!filterExpanded)}
            variant="disabled"
          >
            <FontAwesomeIcon icon={faFilter} />
          </OakButton>
        </div>
      </div>
      <div className="expense-page__main">
        <div className="expense-page__main__left">
          <ListExpense />
        </div>
        <div
          className={`expense-page__main__right ${
            filterExpanded ? 'expense-page__main__right--active' : ''
          }`}
        >
          test
        </div>
      </div>
    </div>
  );
};

export default ExpensePage;
