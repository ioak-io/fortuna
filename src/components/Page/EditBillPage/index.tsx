import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { addDays, format } from 'date-fns';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.scss';
import ReceiptModel from '../../../model/ReceiptModel';
import ExpenseModel from '../../../model/ExpenseModel';
import BillDetails from './BillDetails';
import ExpenseItems from './ExpenseItems';
import OakButton from '../../../oakui/wc/OakButton';
import { newId } from '../../../events/MessageService';
import OakForm from '../../../oakui/wc/OakForm';
import { isEmptyAttributes, isEmptyOrSpaces } from '../../../components/Utils';
import { saveBill, getBillById } from './service';
import {
  FORTUNA_PREF_ADDBILL_ANOTHER,
  FORTUNA_PREF_ADDBILL_DATE,
} from '../../../constants/SessionStorageConstants';
import OakCheckbox from '../../../oakui/wc/OakCheckbox';
import Topbar from '../../../components/Topbar';
import { updateExpenseItems } from '../../../store/actions/ExpenseActions';
import { updateReceiptItems } from '../../../store/actions/ReceiptActions';
import { useSearchParams } from 'react-router-dom';

const EMPTY_EXPENSE: ExpenseModel = {
  amount: undefined,
  billDate: '',
  category: '',
  description: '',
  tagId: [],
};

const EMPTY_BILL: ReceiptModel = {
  billDate: format(new Date(), 'yyyy-MM-dd'),
  items: [{ ...EMPTY_EXPENSE }],
  number: '',
  total: 0,
  description: '',
};

interface Props {
  space: string;
  location: any;
}

const EditBillPage = (props: Props) => {
  const dispatch = useDispatch();
  const getEmptyBill = (): ReceiptModel => {
    return {
      ...EMPTY_BILL,
      billDate:
        sessionStorage.getItem(FORTUNA_PREF_ADDBILL_DATE) ||
        EMPTY_BILL.billDate,
    };
  };
  const [queryParam, setQueryParam] = useState<any>({});
  const history = useHistory();
  const authorization = useSelector((state: any) => state.authorization);
  const [formId, setFormId] = useState(newId());
  const [errorInItemList, setErrorInItemList] = useState<boolean[]>([]);
  const [errorInBillDetails, setErrorInBillDetails] = useState<boolean>(false);
  const [state, setState] = useState<ReceiptModel>({ ...getEmptyBill() });
  const [addAnother, setAddAnother] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(FORTUNA_PREF_ADDBILL_ANOTHER)) {
      setAddAnother(
        sessionStorage.getItem(FORTUNA_PREF_ADDBILL_ANOTHER) === 'true'
      );
    }
  }, []);

  useEffect(() => {
    if (queryParam?.id && authorization.isAuth) {
      getBillById(props.space, queryParam.id, authorization).then(
        (response: any) => {
          if (!isEmptyAttributes(response)) {
            setState({
              ...response,
              items: [...response.items, { ...EMPTY_EXPENSE }],
            });
          }
        }
      );
    }
  }, [queryParam, authorization]);

  // useEffect(() => {
  //   addRow(state.items);
  // }, []);

  const addRow = (_existingItems: ExpenseModel[], total?: number) => {
    const items: ExpenseModel[] = [..._existingItems];
    items.push({ ...EMPTY_EXPENSE });
    setState({ ...state, total: total || state.total, items });
  };

  const handleBillChange = (_bill: ReceiptModel) => {
    setState(_bill);
  };

  const handleItemsChange = (items: ExpenseModel[], isAddRow: boolean) => {
    let total: number = 0;
    items.forEach((item) => {
      total += item.amount || 0;
    });
    if (isAddRow) {
      addRow(items, total);
    } else {
      setState({ ...state, total, items });
    }
  };

  const save = (_addAnother: boolean) => {
    const items = state.items.filter(
      (item: ExpenseModel) =>
        !isEmptyOrSpaces(item._id) ||
        !isEmptyOrSpaces(item.description) ||
        (item.amount && item.amount > 0) ||
        !isEmptyOrSpaces(item.category)
    );
    items.push({ ...EMPTY_EXPENSE });

    const _errorInItemList: boolean[] = [];
    items.forEach((item: ExpenseModel, index: number) => {
      _errorInItemList.push(
        (index !== items.length - 1 || index === 0) &&
          (isEmptyOrSpaces(item.description) ||
            (item.amount && item.amount < 1) ||
            isEmptyOrSpaces(item.category))
      );
    });
    const _state = { ...state, items };
    setState(_state);
    setErrorInItemList(_errorInItemList);
    if (!state.billDate) {
      setErrorInBillDetails(true);
    }
    if (!_errorInItemList.includes(true) && state.billDate) {
      saveBill(
        props.space,
        {
          ..._state,
          items: _state.items.filter((item) => !isEmptyOrSpaces(item.category)),
        },
        authorization
      ).then((response: any) => {
        if (!isEmptyAttributes(response)) {
          const { items, ..._receipt } = response;
          dispatch(updateReceiptItems([_receipt]));
          dispatch(updateExpenseItems(items));
          setState({
            ...response,
            items: [...response.items, { ...EMPTY_EXPENSE }],
          });
          if (!_addAnother) {
            history.goBack();
          } else {
            setState({ ...getEmptyBill() });
          }
        }
      });
    }
  };

  const saveAndAddAnother = () => {
    save(true);
  };

  const saveAndClose = () => {
    save(false);
  };

  const goBack = () => {
    history.goBack();
  };

  const toggleAddAnother = () => {
    sessionStorage.setItem(
      FORTUNA_PREF_ADDBILL_ANOTHER,
      (!addAnother).toString()
    );
    setAddAnother(!addAnother);
  };

  return (
    <div className="edit-bill-page page-animate">
      <Topbar title={queryParam.id ? 'Edit bill' : 'New bill'}>right</Topbar>
      {/* <OakForm formGroupName={formId} handleSubmit={save}> */}
      <div className="edit-bill-page__main main-section">
        <div className="edit-bill-page__main__bill page-width content-section">
          <BillDetails
            bill={state}
            handleChange={handleBillChange}
            formId={formId}
            errors={errorInBillDetails}
          />
        </div>
        <div className="edit-bill-page__main__expense page-width content-section">
          <ExpenseItems
            data={state.items}
            handleChange={handleItemsChange}
            formId={formId}
            errors={errorInItemList}
          />
        </div>
      </div>
      {/* </OakForm> */}
      <div className="footer">
        <div className="edit-bill-page__footer__left">
          {/* {!queryParam.id && (
            <OakCheckbox
              name="addAnother"
              value={addAnother}
              handleChange={toggleAddAnother}
            >
              Add another
            </OakCheckbox>
          )} */}
        </div>
        <div className="footer-right">
          {/* <OakButton
            theme="primary"
            variant="regular"
            type="submit"
            formGroupName={formId}
            handleClick={save}
          >
            <FontAwesomeIcon icon={faCheck} />
            {!addAnother || queryParam.id
              ? 'Save and go back'
              : 'Save and create another bill'}
          </OakButton> */}
          <OakButton
            theme="primary"
            variant="regular"
            handleClick={saveAndClose}
          >
            <FontAwesomeIcon icon={faCheck} />
            Save and close
          </OakButton>
          {!queryParam.id && (
            <OakButton
              theme="primary"
              variant="regular"
              handleClick={saveAndAddAnother}
            >
              <FontAwesomeIcon icon={faCheck} />
              Save and add another
            </OakButton>
          )}
          {/* <OakButton theme="info" variant="regular" handleClick={save}>
            <FontAwesomeIcon icon={faCheck} /> Save and Close
          </OakButton> */}
          <OakButton theme="info" variant="regular" handleClick={goBack}>
            <FontAwesomeIcon icon={faTimes} />
          </OakButton>
        </div>
      </div>
    </div>
  );
};

export default EditBillPage;
