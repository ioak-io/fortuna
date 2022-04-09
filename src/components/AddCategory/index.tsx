import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addDays, format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import OakModal from '../../oakui/wc/OakModal';
import AddCategoryCommand from '../../events/AddCategoryCommand';
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

import { saveCategory } from './service';

interface Props {
  space: string;
}

const AddCategory = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);
  const profile = useSelector((state: any) => state.profile);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formId, setFormId] = useState(newId());
  const [stepNumber, setStepNumber] = useState(1);
  const [state, setState] = useState({ name: '', kakeibo: '' });
  const [anotherDay, setAnotherDay] = useState(false);
  const [todayDate, setTodayDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [yesterdayDate, setYesterdayDate] = useState(
    format(addDays(new Date(), 1), 'yyyy-MM-dd')
  );

  useEffect(() => {
    AddCategoryCommand.subscribe((message) => {
      setIsOpen(message);
    });
  }, []);

  const handleClose = () => {
    AddCategoryCommand.next(false);
  };

  const handleChange = (detail: any) => {
    setState({ ...state, [detail.name]: detail.value });
  };

  const updatekakeibo = (kakeibo: string) => {
    setState({ ...state, kakeibo });
  };

  const save = () => {
    console.log('save');
    saveCategory(props.space, state, authorization);
    AddCategoryCommand.next(false);
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
        heading="New category"
      >
        <div slot="body">
          <div className="add-category">
            <OakForm formGroupName={formId} handleSubmit={save}>
              <div className="add-category__form">
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
                />
                <div>
                  <div className="add-category__form__chips">
                    <button
                      className={`add-category__form__chips__chip ${
                        state.kakeibo === 'Needs'
                          ? 'add-category__form__chips__chip--selected'
                          : ''
                      }`}
                      onClick={() => updatekakeibo('Needs')}
                    >
                      Needs
                    </button>
                    <button
                      className={`add-category__form__chips__chip ${
                        state.kakeibo === 'Wants'
                          ? 'add-category__form__chips__chip--selected'
                          : ''
                      }`}
                      onClick={() => updatekakeibo('Wants')}
                    >
                      Wants
                    </button>
                    <button
                      className={`add-category__form__chips__chip ${
                        state.kakeibo === 'Culture'
                          ? 'add-category__form__chips__chip--selected'
                          : ''
                      }`}
                      onClick={() => updatekakeibo('Culture')}
                    >
                      Culture
                    </button>
                    <button
                      className={`add-category__form__chips__chip ${
                        state.kakeibo === 'Unexpected'
                          ? 'add-category__form__chips__chip--selected'
                          : ''
                      }`}
                      onClick={() => updatekakeibo('Unexpected')}
                    >
                      Unexpected
                    </button>
                  </div>
                </div>
              </div>
            </OakForm>
          </div>
        </div>
        <div slot="footer">
          <div className="add-category-footer">
            <OakButton
              formGroupName={formId}
              type="submit"
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

export default AddCategory;
