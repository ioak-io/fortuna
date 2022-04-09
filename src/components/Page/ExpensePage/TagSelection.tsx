import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OakInput from '../../../oakui/wc/OakInput';

import './TagSelection.scss';
import { isEmptyOrSpaces } from '../../Utils';

interface Props {
  tagIdList: string[];
  handleChange: any;
}

const TagSelection = (props: Props) => {
  const tags = useSelector((state: any) => state.tag.items);
  const [searchText, setSearchText] = useState('');
  const [tagsFiltered, setTagsFiltered] = useState([]);

  useEffect(() => {
    if (isEmptyOrSpaces(searchText)) {
      setTagsFiltered(tags);
    } else {
      setTagsFiltered(
        tags.filter((tag: any) => tag.name.toLowerCase().includes(searchText))
      );
    }
  }, [tags, searchText]);

  const handleChange = (detail: any) => {
    setSearchText(detail.value);
  };

  const handleTagChange = (tag: any) => {
    if (props.tagIdList?.includes(tag._id)) {
      props.handleChange(props.tagIdList?.filter((item) => item !== tag._id));
    } else {
      props.handleChange([...(props.tagIdList || []), tag._id]);
    }
  };

  return (
    <div className="tag-selection-filter">
      {/* <div className="tag-selection-filter__search">
        <OakInput
          name="searchText"
          value={searchText}
          gutterBottom
          handleInput={handleChange}
          size="large"
          color="container"
          placeholder="Search tag"
          shape="underline"
        />
      </div> */}
      <label>Tag</label>
      <div className="tag-selection-filter__list">
        {tagsFiltered &&
          tagsFiltered.map((tag: any) => (
            <button
              key={tag._id}
              className={`tag-selection-filter__list__chip ${
                props.tagIdList?.includes(tag._id)
                  ? 'tag-selection-filter__list__chip--selected'
                  : ''
              }`}
              onClick={() => handleTagChange(tag)}
            >
              {tag.name}
            </button>
          ))}
      </div>
    </div>
  );
};

export default TagSelection;
