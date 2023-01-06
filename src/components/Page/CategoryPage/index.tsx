import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
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
import EditIncomeCategory from '../../../components/EditIncomeCategory';
import EditTag from '../../../components/EditTag';
import EditTagCommand from '../../../events/EditTagCommand';
import EditIncomeCategoryCommand from '../../../events/EditIncomeCategoryCommand';
import ManageIncomeCategory from './ManageIncomeCategory';

interface Props {
  space: string;
  location: any;
}

const CategoryItem = (props: Props) => {
  const [queryParam, setQueryParam] = useState<any>({});
  const navigate = useNavigate();
  const authorization = useSelector((state: any) => state.authorization);
  const [formId, setFormId] = useState(newId());

  const addNewCategory = () => {
    EditCategoryCommand.next({ open: true });
  };

  const addNewIncomeCategory = () => {
    EditIncomeCategoryCommand.next({ open: true });
  };

  const addNewTag = () => {
    EditTagCommand.next({ open: true });
  };

  return (
    <>
      <EditCategory space={props.space} />
      <EditIncomeCategory space={props.space} />
      <EditTag space={props.space} />
      <div className="category-page page-animate">
        <Topbar title="Categories and tags">right</Topbar>
        <div className="category-page__main main-section">
          <div className="category-page__main__category page-width content-section">
            <div className="page-title">
              <div className="">Expense categories</div>
              <OakButton handleClick={addNewCategory}>
                <FontAwesomeIcon icon={faPlus} />
                New
              </OakButton>
            </div>
            <ManageCategory space={props.space} location={props.location} />
          </div>
          <div className="category-page__main__category page-width content-section">
            <div className="page-title">
              <div className="">Income categories</div>
              <OakButton handleClick={addNewIncomeCategory}>
                <FontAwesomeIcon icon={faPlus} />
                New
              </OakButton>
            </div>
            <ManageIncomeCategory
              space={props.space}
              location={props.location}
            />
          </div>
          <div className="category-page__main__tag page-width content-section">
            <div className="page-title">
              <div className="">Tags</div>
              <OakButton handleClick={addNewTag}>
                <FontAwesomeIcon icon={faPlus} />
                New
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
