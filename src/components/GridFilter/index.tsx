import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookmark,
  faCheck,
  faChevronRight,
  faCog,
  faCogs,
  faSave,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { compose as tableCompose } from '@oakui/core-stage/style-composer/OakTableComposer';

import './style.scss';
import OakTypography from '../../oakui/wc/OakTypography';
import OakInput from '../../oakui/wc/OakInput';
import { newId } from '../../events/MessageService';
import CategorySelection from './CategorySelection';
import KakeiboSelection from './KakeiboSelection';
import OakButton from '../../oakui/wc/OakButton';
import ExpenseFilterModel from '../../model/ExpenseFilterModel';
import AddFilterExpenseCommand from '../../events/AddFilterExpenseCommand';
import ManageFilterExpenseCommand from '../../events/ManageFilterExpenseCommand';
import TagSelection from './TagSelection';

interface Props {
  emptyFilter: any;
  applyFilter: any;
  closeFilter: any;
  saveFilter: any;
  manageFilter: any;
  filterFromState: any;
  categories: any[];
}

const GridFilter = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);
  const [formId, setFormId] = useState(newId());

  const [state, setState] = useState<ExpenseFilterModel>({
    ...props.emptyFilter,
  });

  useEffect(() => {
    setState({ ...props.filterFromState });
  }, [props.filterFromState]);

  const handleChange = (detail: any) => {
    setState({
      ...state,
      [detail.name]: detail.value,
      _id: undefined,
      name: '',
    });
  };

  const handleCategoryChange = (categoryIdList: string[]) => {
    setState({ ...state, categoryIdList, _id: undefined, name: '' });
  };

  const handleKakeiboChange = (kakeiboList: string[]) => {
    setState({ ...state, kakeiboList, _id: undefined, name: '' });
  };

  const handleTagChange = (tagIdList: string[]) => {
    setState({ ...state, tagIdList, _id: undefined, name: '' });
  };

  const applyFilter = () => {
    props.applyFilter({ ...state });
  };

  const resetFilter = () => {
    props.applyFilter({ ...props.emptyFilter });
    setState({ ...props.emptyFilter });
  };

  const saveFilter = () => {
    props.saveFilter({ ...state });
  };

  const manageFilter = () => {
    props.manageFilter();
  };

  return (
    <div className="grid-filter">
      {/* <div className="grid-filter__topbar">Filter criteria</div> */}
      <div className="grid-filter__name">
        <div>{state._id ? state.name : 'New filter'}</div>
        <button className="button" onClick={props.closeFilter}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="grid-filter__main">
        <OakInput
          name="description"
          value={state.description}
          formGroupName={formId}
          handleInput={handleChange}
          size="large"
          color="container"
          shape="rectangle"
          label="Search text"
          placeholder="search in description"
        />
        <div className="form-two-column">
          <OakInput
            name="moreThan"
            value={state.moreThan}
            formGroupName={formId}
            type="number"
            handleInput={handleChange}
            size="large"
            color="container"
            shape="rectangle"
            label="Amount more than"
            placeholder="amount above"
          />
          <OakInput
            name="lessThan"
            value={state.lessThan}
            formGroupName={formId}
            type="number"
            handleInput={handleChange}
            size="large"
            color="container"
            shape="rectangle"
            label="Amount less than"
            placeholder="amount upto"
          />
          <OakInput
            name="from"
            value={state.from}
            formGroupName={formId}
            type="date"
            handleInput={handleChange}
            size="large"
            color="container"
            placeholder="From"
            shape="rectangle"
            label="From"
          />
          <OakInput
            name="to"
            value={state.to}
            formGroupName={formId}
            type="date"
            handleInput={handleChange}
            size="large"
            color="container"
            placeholder="To"
            shape="rectangle"
            label="To"
          />
          <OakInput
            name="days"
            value={state.days}
            formGroupName={formId}
            type="number"
            handleInput={handleChange}
            size="large"
            color="container"
            shape="rectangle"
            label="Past N days"
            placeholder="days in relation to today"
          />
          <OakInput
            name="months"
            value={state.months}
            formGroupName={formId}
            type="number"
            handleInput={handleChange}
            size="large"
            color="container"
            shape="rectangle"
            label="Past N months"
            placeholder="calendar months"
          />
          <OakInput
            name="monthNumber"
            value={state.monthNumber}
            formGroupName={formId}
            type="number"
            handleInput={handleChange}
            size="large"
            color="container"
            shape="rectangle"
            label="Nth month"
            placeholder="single month data"
            tooltip="Tip: 6 indicates January month this year, if current month is June"
          />
          <OakInput
            name="yearNumber"
            value={state.yearNumber}
            formGroupName={formId}
            type="number"
            handleInput={handleChange}
            size="large"
            color="container"
            shape="rectangle"
            label="Nth year"
            placeholder="single year data"
            tooltip="Tip: 3 indicates year 2020, if current year is 2022"
          />
        </div>
        <CategorySelection
          handleChange={handleCategoryChange}
          categoryIdList={state.categoryIdList}
          categories={props.categories}
        />
        {state.kakeiboList && (
          <KakeiboSelection
            handleChange={handleKakeiboChange}
            kakeiboList={state.kakeiboList}
          />
        )}
        <TagSelection
          handleChange={handleTagChange}
          tagIdList={state.tagIdList}
        />
      </div>
      <div className="grid-filter__action">
        <OakButton theme="primary" variant="regular" handleClick={applyFilter}>
          <FontAwesomeIcon icon={faCheck} /> Apply
        </OakButton>
        <OakButton theme="info" variant="regular" handleClick={saveFilter}>
          <FontAwesomeIcon icon={faBookmark} /> Save
        </OakButton>
        <OakButton theme="info" variant="regular" handleClick={resetFilter}>
          <FontAwesomeIcon icon={faTimes} />
        </OakButton>
        <OakButton theme="info" variant="regular" handleClick={manageFilter}>
          <FontAwesomeIcon icon={faCog} />
        </OakButton>
      </div>
    </div>
  );
};

export default GridFilter;
