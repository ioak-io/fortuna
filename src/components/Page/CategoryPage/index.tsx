import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import './style.scss';
import { newId } from '../../../events/MessageService';
import Topbar from '../../../components/Topbar';
import ManageCategory from './ManageCategory';
import EditCategoryCommand from '../../../events/EditCategoryCommand';
import OakButton from '../../../oakui/wc/OakButton';
import ManageTag from './ManageTag';
import EditCategory from '../../../components/EditCategory';
import EditTag from '../../../components/EditTag';
import EditTagCommand from '../../../events/EditTagCommand';

interface Props {
  space: string;
  location: any;
}

const CategoryItem = (props: Props) => {
  const [queryParam, setQueryParam] = useState<any>({});
  const history = useHistory();
  const authorization = useSelector((state: any) => state.authorization);
  const [formId, setFormId] = useState(newId());

  const addNewCategory = () => {
    EditCategoryCommand.next({ open: true });
  };

  const addNewTag = () => {
    EditTagCommand.next({ open: true });
  };

  const save = (_addAnother: boolean) => {
    // saveBill(
    //   props.space,
    //   {
    //     ..._state,
    //     items: _state.items.filter((item) => !isEmptyOrSpaces(item.category)),
    //   },
    //   authorization
    // ).then((response: any) => {
    //   if (!isEmptyAttributes(response)) {
    //     setState({
    //       ...response,
    //       items: [...response.items, { ...EMPTY_EXPENSE }],
    //     });
    //     // if (!_addAnother || queryParam.id) {
    //     if (!_addAnother) {
    //       history.goBack();
    //     } else {
    //       setState({ ...getEmptyBill() });
    //     }
    //   }
    // });
  };

  return (
    <>
      <EditCategory space={props.space} />
      <EditTag space={props.space} />
      <div className="category-page">
        <Topbar title="Categories and tags">right</Topbar>
        <div className="category-page__main main-section">
          <div className="category-page__main__category page-width content-section">
            <div className="page-title">
              <div className="">Categories</div>
              <OakButton handleClick={addNewCategory}>
                <FontAwesomeIcon icon={faPlus} />
                New category
              </OakButton>
            </div>
            <ManageCategory space={props.space} location={props.location} />
          </div>
          <div className="category-page__main__tag page-width content-section">
            <div className="page-title">
              <div className="">Tags</div>
              <OakButton handleClick={addNewTag}>
                <FontAwesomeIcon icon={faPlus} />
                New tag
              </OakButton>
            </div>
            <ManageTag space={props.space} location={props.location} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryItem;
