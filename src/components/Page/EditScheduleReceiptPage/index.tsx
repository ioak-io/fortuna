import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { addDays, format } from 'date-fns';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.scss';
import ReceiptModel from '../../../model/ReceiptModel';
import ExpenseModel from '../../../model/ExpenseModel';
import ScheduleReceiptItems from './ScheduleReceiptItems';
import ScheduleReceiptDetails from './ScheduleReceiptDetails';
import OakButton from '../../../oakui/wc/OakButton';
import { newId } from '../../../events/MessageService';
import OakForm from '../../../oakui/wc/OakForm';
import { isEmptyAttributes, isEmptyOrSpaces } from '../../../components/Utils';
import { saveScheduleReceipt, getReceiptById } from './service';
import {
  EXPENSO_PREF_ADDBILL_ANOTHER,
  EXPENSO_PREF_ADDBILL_DATE,
} from '../../../constants/SessionStorageConstants';
import OakCheckbox from '../../../oakui/wc/OakCheckbox';
import Topbar from '../../../components/Topbar';
import ScheduleReceiptItemModel from '../../../model/ScheduleReceiptItemModel';
import ScheduleReceiptModel from '../../../model/ScheduleReceiptModel';

const queryString = require('query-string');

const EMPTY_RECEIPT_ITEM: ScheduleReceiptItemModel = {
  _id: undefined,
  category: '',
  description: '',
  tagId: [],
  amount: undefined,
};

const EMPTY_RECEIPT: ScheduleReceiptModel = {
  _id: undefined,
  from: format(new Date(), 'yyyy-MM-dd'),
  to: format(
    new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    'yyyy-MM-dd'
  ),
  name: '',
  description: '',
  recurrence: undefined,
  total: 0,
  daysInMonth: [],
  daysInWeek: [],
  monthsInYear: [],
  items: [{ ...EMPTY_RECEIPT_ITEM }],
};

interface Props {
  space: string;
  location: any;
}

const EditScheduleReceiptPage = (props: Props) => {
  const getEmptyReceipt = (): ScheduleReceiptModel => {
    return {
      ...EMPTY_RECEIPT,
    };
  };
  const [queryParam, setQueryParam] = useState<any>({});
  const history = useHistory();
  const authorization = useSelector((state: any) => state.authorization);
  const [formId, setFormId] = useState(newId());
  const [errorInItemList, setErrorInItemList] = useState<boolean[]>([]);
  const [errorInReceiptDetails, setErrorInReceiptDetails] =
    useState<boolean>(false);
  const [state, setState] = useState<ScheduleReceiptModel>({
    ...getEmptyReceipt(),
  });

  useEffect(() => {
    const query = queryString.parse(props.location.search);
    setQueryParam(query);
  }, [props.location.search]);

  useEffect(() => {
    if (queryParam?.id && authorization.isAuth) {
      getReceiptById(props.space, queryParam.id, authorization).then(
        (response: any) => {
          if (!isEmptyAttributes(response)) {
            setState({
              ...response,
              items: [...response.items, { ...EMPTY_RECEIPT_ITEM }],
            });
          }
        }
      );
    }
  }, [queryParam, authorization]);

  const addRow = (
    _existingItems: ScheduleReceiptItemModel[],
    total?: number
  ) => {
    const items: ScheduleReceiptItemModel[] = [..._existingItems];
    items.push({ ...EMPTY_RECEIPT_ITEM });
    setState({ ...state, total: total || state.total, items });
  };

  const handleReceiptChange = (_receipt: ScheduleReceiptModel) => {
    setState(_receipt);
  };

  const handleItemsChange = (
    items: ScheduleReceiptItemModel[],
    isAddRow: boolean
  ) => {
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

  const save = () => {
    const items = (state.items || []).filter(
      (item: ScheduleReceiptItemModel) =>
        !isEmptyOrSpaces(item._id) ||
        !isEmptyOrSpaces(item.description) ||
        (item.amount && item.amount > 0) ||
        !isEmptyOrSpaces(item.category)
    );
    items.push({ ...EMPTY_RECEIPT_ITEM });

    const _errorInItemList: boolean[] = [];
    items.forEach((item: ExpenseModel, index: number) => {
      _errorInItemList.push(
        (index !== items.length - 1 || index === 0) &&
          (isEmptyOrSpaces(item.description) ||
            !item.amount ||
            (item.amount && item.amount < 1) ||
            isEmptyOrSpaces(item.category))
      );
    });

    let _errorInReceiptDetails: boolean = false;
    if (isEmptyOrSpaces(state.name) || isEmptyOrSpaces(state.recurrence)) {
      _errorInReceiptDetails = true;
    }

    if (state.recurrence === 'Weekly' && state.daysInWeek?.length === 0) {
      _errorInReceiptDetails = true;
    }

    if (state.recurrence === 'Monthly' && state.daysInMonth?.length === 0) {
      _errorInReceiptDetails = true;
    }

    if (
      state.recurrence === 'Yearly' &&
      (state.daysInMonth?.length === 0 || state.monthsInYear?.length === 0)
    ) {
      _errorInReceiptDetails = true;
    }

    if (state.recurrence !== 'Once' && isEmptyOrSpaces(state.to)) {
      _errorInReceiptDetails = true;
    }

    if (isEmptyOrSpaces(state.from)) {
      _errorInReceiptDetails = true;
    }

    const _state = { ...state, items };
    setState(_state);
    setErrorInItemList(_errorInItemList);
    setErrorInReceiptDetails(_errorInReceiptDetails);
    if (!_errorInItemList.includes(true) && !_errorInReceiptDetails) {
      saveScheduleReceipt(
        props.space,
        {
          ..._state,
          items: _state.items.filter((item) => !isEmptyOrSpaces(item.category)),
        },
        authorization
      ).then((response: any) => {
        if (!isEmptyAttributes(response)) {
          // if (queryParam.id) {
          //   history.push(
          //     `/${props.space}/schedule/receipt/runbook?id=${response._id}`
          //   );
          // } else {
          history.goBack();
          // }
        }
      });
    }
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <div className="edit-schedule-receipt-page">
      <Topbar
        title={
          queryParam.id
            ? `${state.name} - Edit`
            : 'Schedule recurring transactions - New'
        }
      >
        right
      </Topbar>
      {/* <OakForm formGroupName={formId} handleSubmit={save}> */}
      <div className="edit-schedule-receipt-page__main main-section">
        <div className="edit-schedule-receipt-page__main__receipt page-width content-section">
          <ScheduleReceiptDetails
            receipt={state}
            handleChange={handleReceiptChange}
            formId={formId}
            errors={errorInReceiptDetails}
          />
        </div>
        <div className="edit-schedule-receipt-page__main__items page-width content-section">
          <ScheduleReceiptItems
            data={state.items || []}
            handleChange={handleItemsChange}
            formId={formId}
            errors={errorInItemList}
          />
        </div>
      </div>
      <div className="footer">
        <div className="edit-schedule-receipt-page__footer__left" />
        <div className="footer-right">
          <OakButton theme="primary" variant="regular" handleClick={save}>
            <FontAwesomeIcon icon={faCheck} />
            Save and close
          </OakButton>
          <OakButton theme="info" variant="regular" handleClick={goBack}>
            <FontAwesomeIcon icon={faTimes} />
          </OakButton>
        </div>
      </div>
    </div>
  );
};

export default EditScheduleReceiptPage;
