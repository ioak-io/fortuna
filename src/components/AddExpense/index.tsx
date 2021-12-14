import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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

const AddExpense = () => {
  const authorization = useSelector((state: any) => state.authorization);
  const profile = useSelector((state: any) => state.profile);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formId, setFormId] = useState(newId());
  const [state, setState] = useState({
    description: '',
    billDate: new Date(),
    amount: 0.0,
    category: 'Telephone',
  });

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
        animationStyle="zoom"
        animationSpeed="normal"
        height="medium"
        width="large"
        heading="Record expense"
      >
        <div slot="body">
          <div className="add-expense">
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
          </div>
        </div>
        <div slot="footer">
          <div className="add-expense-footer">
            <OakButton formGroupName={formId} type="submit" theme="primary">
              Save and Add New
            </OakButton>
            <OakButton formGroupName={formId} type="button" theme="default">
              Save and Close
            </OakButton>
            <OakButton formGroupName={formId} type="button" theme="default">
              Close
            </OakButton>
          </div>
        </div>
      </OakModal>
    </>
  );
};

export default AddExpense;
