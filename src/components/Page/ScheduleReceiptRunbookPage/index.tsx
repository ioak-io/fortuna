import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { addDays, format } from 'date-fns';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.scss';
import ReceiptModel from '../../../model/ReceiptModel';
import ExpenseModel from '../../../model/ExpenseModel';
import OakButton from '../../../oakui/wc/OakButton';
import { newId } from '../../../events/MessageService';
import OakForm from '../../../oakui/wc/OakForm';
import { isEmptyAttributes, isEmptyOrSpaces } from '../../../components/Utils';
import {
  EXPENSO_PREF_ADDBILL_ANOTHER,
  EXPENSO_PREF_ADDBILL_DATE,
} from '../../../constants/SessionStorageConstants';
import OakCheckbox from '../../../oakui/wc/OakCheckbox';
import Topbar from '../../../components/Topbar';
import ScheduleReceiptItemModel from '../../../model/ScheduleReceiptItemModel';
import ScheduleReceiptModel from '../../../model/ScheduleReceiptModel';
import { getReceiptById } from '../EditScheduleReceiptPage/service';
import Details from './Details';
import RunLog from './RunLog';
import { getLog } from './service';

const queryString = require('query-string');

interface Props {
  space: string;
  location: any;
}

const ScheduleReceiptRunbookPage = (props: Props) => {
  const [queryParam, setQueryParam] = useState<any>({});
  const history = useHistory();
  const authorization = useSelector((state: any) => state.authorization);
  const [data, setData] = useState<ScheduleReceiptModel | null>();
  const [logData, setLogData] = useState<any[]>([]);
  const [formId, setFormId] = useState(newId());
  const [errorInItemList, setErrorInItemList] = useState<boolean[]>([]);
  const [errorInReceiptDetails, setErrorInReceiptDetails] =
    useState<boolean>(false);

  useEffect(() => {
    const query = queryString.parse(props.location.search);
    setQueryParam(query);
  }, [props.location.search]);

  useEffect(() => {
    if (queryParam?.id && authorization.isAuth) {
      getReceiptById(props.space, queryParam.id, authorization).then(
        (response: any) => {
          if (!isEmptyAttributes(response)) {
            setData(response);
          }
        }
      );
    }
  }, [queryParam, authorization]);

  useEffect(() => {
    if (authorization.isAuth && data?._id) {
      getLog(props.space, data._id, authorization).then((response: any) => {
        setLogData([...response]);
      });
    }
  }, [authorization, data]);

  const handleDataChange = (_logData: any[]) => {
    console.log(_logData);
    setLogData(_logData);
  };

  const goBack = () => {
    history.goBack();
  };

  const goToEditSchedule = () => {
    history.push(`/${props.space}/schedule/receipt/edit?id=${queryParam.id}`);
  };

  return (
    <div className="schedule-receipt-runbook-page">
      <Topbar title={data ? `${data.name} - Runbook` : ''}>
        <OakButton handleClick={goToEditSchedule}>Edit schedule</OakButton>
      </Topbar>
      <div className="main-section schedule-receipt-runbook-page__main">
        <div className="schedule-receipt-runbook-page__main__section page-width content-section">
          {data && (
            <Details
              receipt={data}
              space={props.space}
              handleDataChange={handleDataChange}
            />
          )}
        </div>
        <div className="schedule-receipt-runbook-page__main__section page-width content-section">
          {data && <RunLog space={props.space} data={logData} />}
        </div>
      </div>
    </div>
  );
};

export default ScheduleReceiptRunbookPage;
