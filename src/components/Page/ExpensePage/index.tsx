import {
  faFileExport,
  faFilter,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddCategoryCommand from '../../../events/AddCategoryCommand';
import OakButton from '../../../oakui/wc/OakButton';
import ListExpense from './ListExpense';
import './style.scss';
import Filter from './Filter';
import Summary from './Summary';
import AddExpense from '../../AddExpense';
import { ExpenseFilterState } from '../../../simplestates/ExpenseFilterState';
import { fetchAndSetExpenseItems } from '../../../actions/ExpenseActions';
import Topbar from '../../../components/Topbar';
import AddCategory from '../../../components/AddCategory';
import AddFilterExpense from '../../../components/AddFilterExpense';
import ManageFilterExpense from '../../../components/ManageFilterExpense';

interface Props {
  history: any;
  space: string;
}

const ExpensePage = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);
  const dispatch = useDispatch();

  const [filterExpanded, setFilterExpanded] = useState(true);
  // const [searchCriteria, setSearchCriteria] = useState<any>({});

  const openAddCategory = () => {
    AddCategoryCommand.next(true);
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
      <AddCategory space={props.space} />
      <AddFilterExpense space={props.space} />
      <ManageFilterExpense space={props.space} />
      <div className="expense-page">
        <Topbar title="Expense listing">
          {/* <div className="expense-page__topbar__right">
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
              handleClick={openAddExpense}
            >
              <FontAwesomeIcon icon={faPlus} /> Quick add
            </OakButton>
            <OakButton
              theme="info"
              variant="regular"
              handleClick={openAddCategory}
            >
              <FontAwesomeIcon icon={faPlus} /> Category
            </OakButton>
          </div> */}
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
      <div className="expense-page__filter">
        <Filter applyFilter={applyFilter} />
      </div>
    </>
  );
};

export default ExpensePage;
