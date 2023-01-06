import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addDays, format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faMoneyBill,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import OakModal from '../../oakui/wc/OakModal';
import QuickEditExpenseCommand from '../../events/QuickEditExpenseCommand';
import {
  receiveMessage,
  sendMessage,
  newId,
} from '../../events/MessageService';
import OakForm from '../../oakui/wc/OakForm';
import OakInput from '../../oakui/wc/OakInput';

import './style.scss';
import OakButton from '../../oakui/wc/OakButton';

import { saveExpense } from './service';
import CategorySelection from './CategorySelection';
import { isEmptyOrSpaces } from '../Utils';
import OakCheckbox from '../../oakui/wc/OakCheckbox';
import { FORTUNA_PREF_ADDEXPENSE_ANOTHER } from '../../constants/SessionStorageConstants';
import TagSelection from './TagSelection';
import ExpenseModel from '../../model/ExpenseModel';
import { updateExpenseItems } from '../../store/actions/ExpenseActions';
import { useNavigate } from 'react-router-dom';

interface Props {
  space: string;
}

const AddExpense = (props: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [emptyExpense, setEmptyExpense] = useState<any>({
    _id: undefined,
    description: '',
    billDateString: format(new Date(), 'yyyy-MM-dd'),
    amount: undefined,
    category: '',
    tagId: [],
    billId: undefined,
  });
  const authorization = useSelector((state: any) => state.authorization);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formId, setFormId] = useState(newId());
  const [state, setState] = useState({ ...emptyExpense });
  const [addAnother, setAddAnother] = useState(false);

  const [categoryNotChosen, setCategoryNotChosen] = useState(false);

  useEffect(() => {
    setFormId(newId());
  }, [isOpen]);

  useEffect(() => {
    QuickEditExpenseCommand.subscribe((message) => {
      if (message.open && message.record) {
        setState({
          description: message.record.description,
          amount: message.record.amount,
          billDateString: message.record.billDate,
          _id: message.record._id,
          category: message.record.category,
          billId: message.record.billId,
          tagId: message.record.tagId,
        });
      }
      setIsOpen(message.open);
    });

    if (sessionStorage.getItem(FORTUNA_PREF_ADDEXPENSE_ANOTHER)) {
      setAddAnother(
        sessionStorage.getItem(FORTUNA_PREF_ADDEXPENSE_ANOTHER) === 'true'
      );
    }
  }, []);

  const handleClose = () => {
    setCategoryNotChosen(false);
    setState({ ...emptyExpense });
    QuickEditExpenseCommand.next({ open: false, record: null });
  };

  const handleChange = (detail: any) => {
    console.log(emptyExpense);
    setState({ ...state, [detail.name]: detail.value });
    if (detail.name === 'billDateString') {
      setEmptyExpense({ ...emptyExpense, billDateString: detail.value });
    }
  };

  const handleCategoryChange = (category: string) => {
    setState({ ...state, category });
    setCategoryNotChosen(false);
  };

  const handleRemoveTag = (tagId: string) => {
    console.log('remove', tagId);
    setState({
      ...state,
      tagId: state.tagId.filter((_tagId: any) => _tagId !== tagId),
    });
  };

  const handleAddTag = (tagId: string) => {
    if (state.tagId) {
      setState({ ...state, tagId: [...state.tagId, tagId] });
    } else {
      setState({ ...state, tagId: [tagId] });
    }
  };

  const toggleAddAnother = () => {
    sessionStorage.setItem(
      FORTUNA_PREF_ADDEXPENSE_ANOTHER,
      (!addAnother).toString()
    );
    setAddAnother(!addAnother);
  };

  const save = () => {
    if (isEmptyOrSpaces(state.category)) {
      setCategoryNotChosen(true);
      return;
    }
    if (state.billDateString && state.amount && state.description) {
      saveExpense(
        props.space,
        { ...state, billDate: state.billDateString },
        authorization
      ).then((response: any) => {
        if (!addAnother || state._id) {
          QuickEditExpenseCommand.next({ open: false, record: null });
        }
        setState({ ...emptyExpense });
        setCategoryNotChosen(false);
        dispatch(updateExpenseItems([response]));
      });
    }
  };

  const goToEditBill = () => {
    QuickEditExpenseCommand.next({ open: false, record: null });
    navigate(`/${props.space}/receipt/edit?id=${state.billId}`);
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
        heading="New expense"
      >
        <div slot="body">
          <div className="add-expense">
            {/* <OakForm formGroupName={formId} handleSubmit={save}> */}
            {isOpen && (
              <div className="form">
                <div className="form-two-column">
                  <OakInput
                    name="billDateString"
                    value={state.billDateString}
                    formGroupName={formId}
                    type="date"
                    handleInput={handleChange}
                    size="large"
                    color="container"
                    label="Bill date"
                    shape="rectangle"
                    required
                    disabled={state.billId}
                  />

                  <OakInput
                    name="amount"
                    value={state.amount}
                    type="number"
                    formGroupName={formId}
                    handleInput={handleChange}
                    size="large"
                    color="container"
                    shape="rectangle"
                    label="Amount"
                    nonzero
                    autofocus
                  />
                </div>
                <OakInput
                  name="description"
                  value={state.description}
                  formGroupName={formId}
                  handleInput={handleChange}
                  size="large"
                  color="container"
                  shape="rectangle"
                  label="Details of the expenditure"
                  required
                />
                <CategorySelection
                  handleChange={handleCategoryChange}
                  categoryId={state.category}
                  error={categoryNotChosen}
                />
                <TagSelection
                  addTag={handleAddTag}
                  removeTag={handleRemoveTag}
                  tagId={state.tagId}
                />
              </div>
            )}
            {/* </OakForm> */}
          </div>
        </div>
        <div slot="footer">
          <div className="add-expense-footer">
            {!state._id && (
              <OakCheckbox
                name="addAnother"
                value={addAnother}
                handleChange={toggleAddAnother}
              >
                Add another
              </OakCheckbox>
            )}
            <OakButton
              formGroupName={formId}
              theme="primary"
              variant="regular"
              handleClick={save}
            >
              <FontAwesomeIcon icon={faChevronRight} /> Save
            </OakButton>
            {state.billId && (
              <OakButton
                formGroupName={formId}
                theme="info"
                variant="regular"
                handleClick={goToEditBill}
              >
                <FontAwesomeIcon icon={faMoneyBill} /> Go to bill
              </OakButton>
            )}
            <OakButton
              formGroupName={formId}
              theme="info"
              variant="regular"
              handleClick={handleClose}
            >
              <FontAwesomeIcon icon={faTimes} />
            </OakButton>
          </div>
        </div>
      </OakModal>
    </>
  );
};

export default AddExpense;
