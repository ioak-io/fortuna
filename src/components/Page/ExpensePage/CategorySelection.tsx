import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OakInput from '../../../oakui/wc/OakInput';

import './CategorySelection.scss';
import { isEmptyOrSpaces } from '../../Utils';

interface Props {
  categoryIdList: string[];
  handleChange: any;
}

const CategorySelection = (props: Props) => {
  const categories = useSelector((state: any) => state.category.categories);
  const [searchText, setSearchText] = useState('');
  const [categoriesFiltered, setCategoriesFiltered] = useState([]);

  useEffect(() => {
    if (isEmptyOrSpaces(searchText)) {
      setCategoriesFiltered(categories);
    } else {
      setCategoriesFiltered(
        categories.filter((category: any) =>
          category.name.toLowerCase().includes(searchText)
        )
      );
    }
  }, [categories, searchText]);

  const handleChange = (detail: any) => {
    setSearchText(detail.value);
  };

  const handleCategoryChange = (category: any) => {
    if (props.categoryIdList.includes(category._id)) {
      props.handleChange(
        props.categoryIdList.filter((item) => item !== category._id)
      );
    } else {
      props.handleChange([...props.categoryIdList, category._id]);
    }
  };

  return (
    <div className="category-selection-filter">
      {/* <div className="category-selection-filter__search">
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
      </div> */}
      <label>Category</label>
      <div className="category-selection-filter__list">
        {categoriesFiltered &&
          categoriesFiltered.map((category: any) => (
            <button
              key={category._id}
              className={`category-selection-filter__list__chip ${
                props.categoryIdList.includes(category._id)
                  ? 'category-selection-filter__list__chip--selected'
                  : ''
              }`}
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
