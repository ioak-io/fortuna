import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { compose as tableCompose } from '@oakui/core-stage/style-composer/OakTableComposer';

import './Filter.scss';
import OakTypography from '../../../oakui/wc/OakTypography';
import { getExpense } from './service';
import OakInput from '../../../oakui/wc/OakInput';
import { newId } from '../../../events/MessageService';
import CategorySelection from './CategorySelection';
import KakeiboSelection from './KakeiboSelection';
import OakButton from '../../../oakui/wc/OakButton';

interface Props {
  data?: any;
  applyFilter: any;
}

const Filter = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);
  const [formId, setFormId] = useState(newId());

  const [state, setState] = useState<any>({
    from: '',
    to: '',
    description: '',
    higherThan: 0,
    lowerThan: null,
    categoryIdList: [],
    kakeiboList: [],
  });

  const handleChange = (detail: any) => {
    setState({ ...state, [detail.name]: detail.value });
  };

  const handleCategoryChange = (categoryIdList: string) => {
    setState({ ...state, categoryIdList });
  };

  const handleKakeiboChange = (kakeiboList: string) => {
    setState({ ...state, kakeiboList });
  };

  const applyFilter = () => {
    props.applyFilter({ ...state });
  };

  return (
    <div className="expense-filter">
      <div className="expense-filter__topbar">Filter criteria</div>
      <div className="expense-filter__main">
        <OakInput
          name="description"
          value={state.description}
          formGroupName={formId}
          handleInput={handleChange}
          size="large"
          color="container"
          shape="rectangle"
          label="Search text"
        />
        <div className="expense-filter__main__two-column">
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
        </div>
        <div className="expense-filter__main__two-column">
          <OakInput
            name="Higher than"
            value={state.higherThan}
            formGroupName={formId}
            type="number"
            handleInput={handleChange}
            size="large"
            color="container"
            shape="rectangle"
            label="Higher than"
          />
          <OakInput
            name="Lower than"
            value={state.lowerThan}
            formGroupName={formId}
            type="number"
            handleInput={handleChange}
            size="large"
            color="container"
            shape="rectangle"
            label="Lower than"
          />
        </div>
        <div className="expense-filter__main__two-column">
          <OakInput
            name="Last N days"
            value={state.pastDays}
            formGroupName={formId}
            type="number"
            handleInput={handleChange}
            size="large"
            color="container"
            shape="rectangle"
            label="Last N days"
          />
          <OakInput
            name="Last N months"
            value={state.pastMonths}
            formGroupName={formId}
            type="number"
            handleInput={handleChange}
            size="large"
            color="container"
            shape="rectangle"
            label="Last N months"
          />
        </div>
        <CategorySelection
          handleChange={handleCategoryChange}
          categoryIdList={state.categoryIdList}
        />
        <KakeiboSelection
          handleChange={handleKakeiboChange}
          kakeiboList={state.kakeiboList}
        />
      </div>
      <div className="expense-filter__action">
        <OakButton theme="info" variant="regular" handleClick={() => {}}>
          <FontAwesomeIcon icon={faTimes} /> Reset
        </OakButton>
        <OakButton theme="primary" variant="regular" handleClick={applyFilter}>
          <FontAwesomeIcon icon={faChevronRight} /> Apply Filter
        </OakButton>
      </div>
    </div>
  );
};

export default Filter;
