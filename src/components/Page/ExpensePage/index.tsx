import {
  faFileExport,
  faFilter,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OakButton from '../../../oakui/wc/OakButton';
import ListExpense from './ListExpense';
import './style.scss';
import Filter from './Filter';
import Summary from './Summary';
import AddExpense from '../../AddExpense';
import { ExpenseFilterState } from '../../../simplestates/ExpenseFilterState';
import { fetchAndSetExpenseItems } from '../../../actions/ExpenseActions';
import Topbar from '../../../components/Topbar';
import EditCategory from '../../../components/EditCategory';
import AddFilterExpense from '../../../components/AddFilterExpense';
import ManageFilterExpense from '../../../components/ManageFilterExpense';

interface Props {
  history: any;
  space: string;
}

const ExpensePage = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);
  const dispatch = useDispatch();

  const [filterExpanded, setFilterExpanded] = useState(false);

  const toggleFilter = () => {
    setFilterExpanded(!filterExpanded);
  };

  const applyFilter = (searchCriteria: any) => {
    // setSearchCriteria(searchCriteria);
    // ExpenseFilterState.next(searchCriteria);
    dispatch(
      fetchAndSetExpenseItems(props.space, authorization, {
        ...searchCriteria,
      })
    );
  };

  return (
    <>
      <AddExpense space={props.space} />
      <EditCategory space={props.space} />
      <AddFilterExpense space={props.space} />
      <ManageFilterExpense space={props.space} />
      <div className="expense-page">
        <Topbar title="Expense listing">
          <div className="expense-page__topbar__right">
            <button className="button" onClick={toggleFilter}>
              <FontAwesomeIcon icon={faFilter} />
            </button>
          </div>
        </Topbar>
        <div className="expense-page__main">
          <div className="expense-page__main__summary">
            <Summary space={props.space} />
          </div>
          <div className="expense-page__main__list">
            <ListExpense space={props.space} />
          </div>
        </div>
      </div>
      <div
        className={`expense-page__filter ${
          filterExpanded ? 'expense-page__filter--active' : ''
        }`}
      >
        <Filter applyFilter={applyFilter} closeFilter={toggleFilter} />
      </div>
    </>
  );
};

export default ExpensePage;
