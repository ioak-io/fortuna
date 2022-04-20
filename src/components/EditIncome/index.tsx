import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { addDays, format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faMoneyBill,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import OakModal from '../../oakui/wc/OakModal';
import EditIncomeCommand from '../../events/EditIncomeCommand';
import {
  receiveMessage,
  sendMessage,
  newId,
} from '../../events/MessageService';
import OakForm from '../../oakui/wc/OakForm';
import OakInput from '../../oakui/wc/OakInput';

import './style.scss';
import OakButton from '../../oakui/wc/OakButton';

import { saveIncome } from './service';
import CategorySelection from './CategorySelection';
import { isEmptyOrSpaces } from '../Utils';
import OakCheckbox from '../../oakui/wc/OakCheckbox';
import { EXPENSO_PREF_ADDEXPENSE_ANOTHER } from '../../constants/SessionStorageConstants';
import TagSelection from './TagSelection';
import IncomeModel from '../../model/IncomeModel';
import { updateIncomeItems } from '../../actions/IncomeActions';

interface Props {
  space: string;
}

const EditIncome = (props: Props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [emptyIncome, setEmptyIncome] = useState<any>({
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
  const [state, setState] = useState({ ...emptyIncome });
  const [addAnother, setAddAnother] = useState(false);

  const [categoryNotChosen, setCategoryNotChosen] = useState(false);

  useEffect(() => {
    setFormId(newId());
  }, [isOpen]);

  useEffect(() => {
    EditIncomeCommand.subscribe((message) => {
      if (message.open && message.record) {
        setState({
          description: message.record.description,
          amount: message.record.amount,
          billDateString: message.record.billDate,
          _id: message.record._id,
          category: message.record.category,
          tagId: message.record.tagId,
        });
      }
      setIsOpen(message.open);
    });

    if (sessionStorage.getItem(EXPENSO_PREF_ADDEXPENSE_ANOTHER)) {
      setAddAnother(
        sessionStorage.getItem(EXPENSO_PREF_ADDEXPENSE_ANOTHER) === 'true'
      );
    }
  }, []);

  const handleClose = () => {
    setCategoryNotChosen(false);
    setState({ ...emptyIncome });
    EditIncomeCommand.next({ open: false, record: null });
  };

  const handleChange = (detail: any) => {
    console.log(emptyIncome);
    setState({ ...state, [detail.name]: detail.value });
    if (detail.name === 'billDateString') {
      setEmptyIncome({ ...emptyIncome, billDateString: detail.value });
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
      EXPENSO_PREF_ADDEXPENSE_ANOTHER,
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
      saveIncome(
        props.space,
        { ...state, billDate: state.billDateString },
        authorization
      ).then((response: any) => {
        if (!addAnother || state._id) {
          EditIncomeCommand.next({ open: false, record: null });
        }
        setState({ ...emptyIncome });
        setCategoryNotChosen(false);
        dispatch(updateIncomeItems([response]));
      });
    }
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
        heading="New income"
      >
        <div slot="body">
          <div className="add-income">
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
          <div className="add-income-footer">
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

export default EditIncome;
