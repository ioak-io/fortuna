import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addDays, format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import OakModal from '../../oakui/wc/OakModal';
import EditCategoryCommand from '../../events/EditCategoryCommand';
import {
  receiveMessage,
  sendMessage,
  newId,
} from '../../events/MessageService';
import OakForm from '../../oakui/wc/OakForm';
import OakInput from '../../oakui/wc/OakInput';

import './style.scss';
import OakSelect from '../../oakui/wc/OakSelect';
import OakButton from '../../oakui/wc/OakButton';

import { saveIncomeCategory } from './service';
import { updateCategoryItem } from '../../actions/CategoryActions';
import EditIncomeCategoryCommand from '../../events/EditIncomeCategoryCommand';
import { updateIncomeCategoryItem } from '../../actions/IncomeCategoryActions';

interface Props {
  space: string;
}

const EMPTY_CATEGORY = { _id: undefined, name: '', kakeibo: '' };

const EditIncomeCategory = (props: Props) => {
  const dispatch = useDispatch();
  const authorization = useSelector((state: any) => state.authorization);
  const profile = useSelector((state: any) => state.profile);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formId, setFormId] = useState(newId());
  const [stepNumber, setStepNumber] = useState(1);
  const [state, setState] = useState({ ...EMPTY_CATEGORY });
  const [anotherDay, setAnotherDay] = useState(false);
  const [todayDate, setTodayDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [yesterdayDate, setYesterdayDate] = useState(
    format(addDays(new Date(), 1), 'yyyy-MM-dd')
  );

  useEffect(() => {
    EditIncomeCategoryCommand.subscribe((message) => {
      if (message.open) {
        setState(
          message.record ? { ...message.record } : { ...EMPTY_CATEGORY }
        );
      }
      setIsOpen(message.open);
    });
  }, []);

  const handleClose = () => {
    EditIncomeCategoryCommand.next({ open: false });
  };

  const handleChange = (detail: any) => {
    setState({ ...state, [detail.name]: detail.value });
  };

  const updatekakeibo = (kakeibo: string) => {
    setState({ ...state, kakeibo });
  };

  const save = () => {
    saveIncomeCategory(props.space, state, authorization).then(
      (response: any) => {
        dispatch(updateIncomeCategoryItem(response));
      }
    );
    EditIncomeCategoryCommand.next({ open: false });
  };

  return (
    <>
      <OakModal
        isOpen={isOpen}
        handleClose={handleClose}
        backdropIntensity={3}
        animationStyle="slide"
        animationSpeed="normal"
        height="auto"
        width="auto"
        heading={state._id ? 'Edit income category' : 'New income category'}
      >
        <div slot="body">
          <div className="edit-category">
            {isOpen && (
              // <OakForm formGroupName={formId} handleSubmit={save}>
              <div className="edit-category__form">
                <OakInput
                  name="name"
                  value={state.name}
                  formGroupName={formId}
                  gutterBottom
                  handleInput={handleChange}
                  size="large"
                  color="container"
                  shape="rectangle"
                  label="Category name"
                  autofocus
                />
              </div>
              // </OakForm>
            )}
          </div>
        </div>
        <div slot="footer">
          <div className="edit-category-footer">
            <OakButton
              formGroupName={formId}
              // type="submit"
              handleClick={save}
              theme="primary"
              variant="regular"
            >
              <FontAwesomeIcon icon={faChevronRight} />
              Save
            </OakButton>
          </div>
        </div>
      </OakModal>
    </>
  );
};

export default EditIncomeCategory;
