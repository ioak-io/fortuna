import {
  faFileExport,
  faFilter,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AddCategoryCommand from '../../../events/AddCategoryCommand';
import AddExpenseCommand from '../../../events/AddExpenseCommand';
import OakButton from '../../../oakui/wc/OakButton';
import ListExpense from './ListExpense';
import './style.scss';
import Filter from './Filter';
import Summary from './Summary';

interface Props {
  history: any;
}

const ExpensePage = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);

  const [filterExpanded, setFilterExpanded] = useState(true);

  const openAddExpense = () => {
    AddExpenseCommand.next(true);
  };

  const openAddCategory = () => {
    AddCategoryCommand.next(true);
  };

  const applyFilter = (searchCriteria: any) => {
    console.log(searchCriteria);
  };

  return (
    <>
      <div className="expense-page">
        <div className="expense-page__topbar">
          <div className="expense-page__topbar__left">Expense</div>
          <div className="expense-page__topbar__right">
            <OakButton
              theme="primary"
              variant="regular"
              handleClick={openAddExpense}
            >
              <FontAwesomeIcon icon={faPlus} /> Add
            </OakButton>
            <OakButton
              theme="info"
              variant="regular"
              handleClick={openAddCategory}
            >
              <FontAwesomeIcon icon={faPlus} /> Category
            </OakButton>
            <OakButton
              theme="info"
              variant="regular"
              handleClick={openAddCategory}
            >
              <FontAwesomeIcon icon={faFileExport} /> Export
            </OakButton>
          </div>
        </div>
        <div className="expense-page__main">
          <div className="expense-page__main__summary">
            <Summary />
          </div>
          <div className="expense-page__main__list">
            <ListExpense />
          </div>
        </div>
      </div>
      <div className="expense-page__filter">
        <Filter applyFilter={applyFilter} />
      </div>
    </>
  );
};

export default ExpensePage;
