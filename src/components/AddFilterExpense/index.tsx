import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addDays, format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import OakModal from '../../oakui/wc/OakModal';
import AddFilterExpenseCommand from '../../events/AddFilterExpenseCommand';
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

import { saveFilter } from './service';
import OakRadio from '../../oakui/wc/OakRadio';
import ExpenseFilterModel from '../../model/ExpenseFilterModel';
import OakCheckbox from '../../oakui/wc/OakCheckbox';
import OakRadioGroup from '../../oakui/wc/OakRadioGroup';
import { isEmptyOrSpaces } from '../Utils';

interface Props {
  space: string;
}

const EMPTY_FILTER: ExpenseFilterModel = {
  name: '',
  showInDashboard: false,
  showInSummary: false,
  from: '',
  to: '',
  description: '',
  moreThan: null,
  lessThan: null,
  days: null,
  months: null,
  monthNumber: null,
  yearNumber: null,
  categoryIdList: [],
  kakeiboList: [],
  tagIdList: [],
};

const AddFilterExpense = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);
  const filterExpenseList = useSelector(
    (state: any) => state.filterExpense.items
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formId, setFormId] = useState(newId());
  const [state, setState] = useState<ExpenseFilterModel>({ ...EMPTY_FILTER });
  const [existingFilter, setExistingFilter] =
    useState<ExpenseFilterModel | null>(null);

  useEffect(() => {
    AddFilterExpenseCommand.subscribe((message) => {
      setExistingFilter(null);
      if (message.open && message.payload) {
        setState({ ...EMPTY_FILTER, ...message.payload });
      }
      setIsOpen(message.open);
    });
  }, []);

  const handleClose = () => {
    AddFilterExpenseCommand.next({ open: false });
  };

  const handleChange = (detail: any) => {
    setExistingFilter(null);
    setState({ ...state, [detail.name]: detail.value });
  };

  const save = () => {
    if (isEmptyOrSpaces(state.name)) {
      return;
    }
    if (existingFilter) {
      overwriteExistingFilter();
    }
    const _existingFilter = filterExpenseList.find(
      (item: ExpenseFilterModel) =>
        item.name?.toLowerCase() === state.name?.toLowerCase()
    );
    setExistingFilter(_existingFilter);
    if (!_existingFilter) {
      saveFilter(props.space, { ...state }, authorization);
      AddFilterExpenseCommand.next({ open: false });
    }
  };
  const overwriteExistingFilter = () => {
    saveFilter(
      props.space,
      {
        ...state,
        _id: existingFilter?._id,
        showInSummary: existingFilter?.showInSummary,
        showInDashboard: existingFilter?.showInDashboard,
      },
      authorization
    );
    AddFilterExpenseCommand.next({ open: false });
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
        width="small"
        heading={existingFilter ? 'Update filter' : 'New filter'}
      >
        <div slot="body">
          <div className="add-filter-expense">
            {isOpen && (
              <OakForm formGroupName={formId} handleSubmit={save}>
                <div className="add-filter-expense__form">
                  <OakInput
                    name="name"
                    value={state.name}
                    formGroupName={formId}
                    gutterBottom
                    handleInput={handleChange}
                    size="large"
                    color="container"
                    shape="rectangle"
                    label="Filter name"
                    autofocus
                    required
                  />
                  {/* <div className="add-filter-expense__form__checkbox-group">
                <OakCheckbox
                  name="showInSummary"
                  value={!!state.showInSummary}
                  handleChange={handleChange}
                >
                  Show in summary section
                </OakCheckbox>
                <OakCheckbox
                  name="showInDashboard"
                  value={!!state.showInDashboard}
                  handleChange={handleChange}
                >
                  Show in Dashboard
                </OakCheckbox>
              </div> */}
                </div>
              </OakForm>
            )}
          </div>
          {existingFilter && (
            <div className="add-filter-expense__form">
              A filter with this name already exists. Would you like to
              overwrite the filter?
            </div>
          )}
        </div>
        <div slot="footer">
          <div className="add-filter-expense-footer">
            <OakButton
              type="submit"
              theme={existingFilter ? 'warning' : 'primary'}
              variant="regular"
              formGroupName={formId}
            >
              <FontAwesomeIcon icon={faChevronRight} />
              {existingFilter ? 'Yes, Overwrite existing filter' : 'Save'}
            </OakButton>
          </div>
        </div>
      </OakModal>
    </>
  );
};

export default AddFilterExpense;
