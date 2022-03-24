import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addDays, format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import OakModal from '../../oakui/wc/OakModal';
import AddExpenseCommand from '../../events/AddExpenseCommand';
import {
  receiveMessage,
  sendMessage,
  newId,
} from '../../events/MessageService';
import OakForm from '../../oakui/wc/OakForm';
import OakInput from '../../oakui/wc/OakInput';

import './CategorySelection.scss';
import OakSelect from '../../oakui/wc/OakSelect';
import OakButton from '../../oakui/wc/OakButton';

import { saveExpense } from './service';

interface Props {
  handleChange: any;
}

const CategorySelection = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);
  const categories = useSelector((state: any) => state.category.categories);
  const [searchText, setSearchText] = useState('');

  const handleChange = (detail: any) => {
    setSearchText(detail.value);
  };

  useEffect(() => {
    console.log(categories);
  }, [categories]);

  const handleCategoryChange = (category: any) => {
    props.handleChange(category._id);
  };

  return (
    <div className="category-selection">
      <div className="category-selection__search">
        <OakInput
          name="searchText"
          value={searchText}
          gutterBottom
          handleInput={handleChange}
          size="large"
          color="container"
          placeholder="Search category"
          shape="underline"
        />
      </div>
      <div className="category-selection__list">
        {categories &&
          categories.map((category: any) => (
            <button
              className="category-selection__list__chip"
              onClick={() => handleCategoryChange(category)}
            >
              {category.name}
            </button>
          ))}
      </div>
    </div>
  );
};

export default CategorySelection;
