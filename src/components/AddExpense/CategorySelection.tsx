import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OakInput from '../../oakui/wc/OakInput';

import './CategorySelection.scss';
import { isEmptyOrSpaces } from '../Utils';

interface Props {
  categoryId: string;
  handleChange: any;
  error: boolean;
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
    props.handleChange(category._id);
  };

  return (
    <div className="category-selection">
      <label>Category</label>
      {categories && categories.length > 10 && (
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
      )}
      <div className="category-selection__list">
        {categoriesFiltered &&
          categoriesFiltered.map((category: any) => (
            <button
              key={category._id}
              className={`category-selection__list__chip ${
                props.categoryId === category._id
                  ? 'category-selection__list__chip--selected'
                  : ''
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category.name}
            </button>
          ))}
      </div>
      {props.error && <div className="error">Choose category</div>}
    </div>
  );
};

export default CategorySelection;
