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

import './style.scss';
import OakSelect from '../../oakui/wc/OakSelect';
import OakButton from '../../oakui/wc/OakButton';

import { saveExpense } from './service';
import CategorySelection from './CategorySelection';

const AddExpense = () => {
  const authorization = useSelector((state: any) => state.authorization);
  const profile = useSelector((state: any) => state.profile);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formId, setFormId] = useState(newId());
  const [stepNumber, setStepNumber] = useState(1);
  const [state, setState] = useState({
    description: '',
    billDate: new Date(),
    billDateString: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    amount: 0.0,
    category: '',
  });
  const [anotherDay, setAnotherDay] = useState(false);
  const [todayDate, setTodayDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [yesterdayDate, setYesterdayDate] = useState(
    format(addDays(new Date(), 1), 'yyyy-MM-dd')
  );

  useEffect(() => {
    AddExpenseCommand.subscribe((message) => {
      setIsOpen(message);
    });
  }, []);

  const handleClose = () => {
    AddExpenseCommand.next(false);
  };

  const handleChange = (detail: any) => {
    setState({ ...state, [detail.name]: detail.value });
  };

  const nextStep = () => {
    setStepNumber(stepNumber + 1);
  };

  const previousStep = () => {
    setStepNumber(stepNumber - 1);
  };

  const toggleAnotherDay = () => {
    setAnotherDay(!anotherDay);
  };

  const setToday = () => {
    setState({ ...state, billDateString: todayDate });
  };

  const setYesterday = () => {
    setState({ ...state, billDateString: yesterdayDate });
  };

  const handleCategoryChange = (category: string) => {
    setState({ ...state, category });
  };

  const save = () => {
    console.log('save');
    saveExpense('companyname', state, authorization);
    AddExpenseCommand.next(false);
  };

  return (
    <>
      <OakModal
        isOpen={isOpen}
        handleClose={handleClose}
        backdropIntensity={3}
        animationStyle="slide"
        animationSpeed="normal"
        height="small"
        width="large"
        heading="New expense"
      >
        <div slot="body">
          <div className="add-expense">
            {stepNumber === 1 && (
              <OakForm formGroupName={`1-${formId}`} handleSubmit={nextStep}>
                <div className="add-expense__form">
                  <div className="add-expense__form__question">
                    Details of the expenditure
                  </div>
                  <OakInput
                    name="description"
                    value={state.description}
                    formGroupName={`1-${formId}`}
                    gutterBottom
                    handleInput={handleChange}
                    size="large"
                    color="container"
                    shape="rectangle"
                  />
                </div>
              </OakForm>
            )}
            {stepNumber === 2 && (
              <OakForm formGroupName={`2-${formId}`} handleSubmit={nextStep}>
                <div className="add-expense__form">
                  <div className="add-expense__form__question">
                    How much was spent?
                  </div>
                  <OakInput
                    name="amount"
                    value={state.amount}
                    type="number"
                    formGroupName={`2-${formId}`}
                    gutterBottom
                    handleInput={handleChange}
                    size="large"
                    color="container"
                    shape="rectangle"
                  />
                </div>
              </OakForm>
            )}
            {stepNumber === 3 && (
              <OakForm formGroupName={`3-${formId}`} handleSubmit={nextStep}>
                <div className="add-expense__form">
                  <div className="add-expense__form__question">
                    When did it occur?
                  </div>
                  <div className="add-expense__form__chips">
                    <button
                      className={`add-expense__form__chips__chip ${
                        state.billDateString === todayDate
                          ? 'add-expense__form__chips__chip--selected'
                          : ''
                      }`}
                      onClick={setToday}
                    >
                      Today
                    </button>
                    <button
                      className={`add-expense__form__chips__chip ${
                        state.billDateString === yesterdayDate
                          ? 'add-expense__form__chips__chip--selected'
                          : ''
                      }`}
                      onClick={setYesterday}
                    >
                      Yesterday
                    </button>
                    {state.billDateString !== todayDate &&
                      state.billDateString !== yesterdayDate && (
                        <button
                          className="add-expense__form__chips__chip add-expense__form__chips__chip--selected"
                          onClick={toggleAnotherDay}
                        >
                          {state.billDateString}
                        </button>
                      )}
                    {(state.billDateString === todayDate ||
                      state.billDateString === yesterdayDate) && (
                      <button
                        className="add-expense__form__chips__chip"
                        onClick={toggleAnotherDay}
                      >
                        ...
                      </button>
                    )}
                  </div>
                  {anotherDay && (
                    <OakInput
                      name="billDateString"
                      value={state.billDateString}
                      formGroupName={`3-${formId}`}
                      type="date"
                      gutterBottom
                      handleInput={handleChange}
                      size="large"
                      color="container"
                      placeholder="Bill date"
                      shape="underline"
                    />
                  )}
                </div>
              </OakForm>
            )}
            {stepNumber === 4 && (
              <OakForm formGroupName={`4-${formId}`} handleSubmit={save}>
                <div className="add-expense__form">
                  <div className="add-expense__form__question">
                    What category does it belong to?
                  </div>
                  <CategorySelection handleChange={handleCategoryChange} />
                </div>
              </OakForm>
            )}
          </div>
          {/* <div className="add-expense">
            <OakForm formGroupName={formId} handleSubmit={save}>
              <div className="add-expense__form">
                <OakInput
                  name="billDate"
                  value={state.billDate}
                  formGroupName={formId}
                  type="date"
                  gutterBottom
                  handleInput={handleChange}
                  size="large"
                  color="container"
                  label="Bill date"
                  placeholder="Bill date"
                  shape="underline"
                />
                <OakSelect
                  name="category"
                  value={state.category}
                  formGroupName={formId}
                  options={['Grocery', 'Telephone']}
                  gutterBottom
                  handleInput={handleChange}
                  size="large"
                  color="container"
                  label="Category"
                  placeholder="Category of the expense"
                  shape="underline"
                  autocomplete
                />
                <OakInput
                  name="description"
                  value={state.description}
                  formGroupName={formId}
                  gutterBottom
                  handleInput={handleChange}
                  size="large"
                  color="container"
                  label="Description"
                  placeholder="Detail of the expense"
                  shape="underline"
                />
                <OakInput
                  name="amount"
                  value={state.amount}
                  type="number"
                  formGroupName={formId}
                  gutterBottom
                  handleInput={handleChange}
                  size="large"
                  color="container"
                  label="Amount"
                  placeholder="Price of the expense"
                  shape="underline"
                />
              </div>
            </OakForm>
          </div> */}
        </div>
        <div slot="footer">
          <div className="add-expense-footer">
            {stepNumber !== 1 && (
              <OakButton
                formGroupName={formId}
                theme="default"
                variant="outline"
                handleClick={previousStep}
              >
                <FontAwesomeIcon icon={faChevronLeft} /> Previous
              </OakButton>
            )}
            {stepNumber !== 4 && (
              <OakButton
                formGroupName={`${stepNumber}-${formId}`}
                type="submit"
                theme="default"
                variant="outline"
              >
                Next <FontAwesomeIcon icon={faChevronRight} />
              </OakButton>
            )}
            {stepNumber === 4 && (
              <OakButton
                formGroupName={`${stepNumber}-${formId}`}
                theme="primary"
                variant="regular"
                handleClick={save}
              >
                <FontAwesomeIcon icon={faChevronRight} /> Save
              </OakButton>
            )}
          </div>
        </div>
      </OakModal>
    </>
  );
};

export default AddExpense;
