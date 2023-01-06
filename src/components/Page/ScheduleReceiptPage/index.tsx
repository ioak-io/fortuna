import {
  faFileExport,
  faFilter,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import OakButton from '../../../oakui/wc/OakButton';
import './style.scss';
import { fetchAndSetReceiptItems } from '../../../store/actions/ReceiptActions';
import Topbar from '../../../components/Topbar';
// import AddFilterReceipt from '../../../components/AddFilterReceipt';
// import ManageFilterReceipt from '../../../components/ManageFilterReceipt';
import EditCategory from '../../../components/EditCategory';
import ReceiptFilterModel from '../../../model/ReceiptFilterModel';
import GridFilter from '../../../components/GridFilter';
import ScheduleReceiptModel from '../../../model/ScheduleReceiptModel';
import { getScheduleReceipt } from './service';
import Item from './Item';
// import AddFilterReceiptCommand from '../../../events/AddFilterReceiptCommand';
// import ManageFilterReceiptCommand from '../../../events/ManageFilterReceiptCommand';

interface Props {
  history: any;
  space: string;
}

const ScheduleReceiptPage = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);
  const history = useHistory();
  const [data, setData] = useState<ScheduleReceiptModel[]>([]);

  const addNew = () => {
    navigate(`/${props.space}/schedule/receipt/edit`);
  };

  useEffect(() => {
    if (authorization.isAuth) {
      getScheduleReceipt(props.space, authorization).then((response: any) => {
        if (response) {
          setData([...response]);
        }
      });
    }
  }, [authorization]);

  return (
    <div className="schedule-receipt-page">
      <Topbar title="Schedule recurring transactions" />
      <div className="main-section">
        <div className="schedule-receipt-page__main page-width content-section">
          <div className="page-title">
            <div className="">Schedules</div>
            <OakButton handleClick={addNew}>
              <FontAwesomeIcon icon={faPlus} />
              Add new
            </OakButton>
          </div>
          {/* <ManageCategory space={props.space} location={props.location} /> */}
          <div className="schedule-receipt-page__main__list">
            {data?.map((record: ScheduleReceiptModel) => (
              <Item key={record._id} space={props.space} record={record} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleReceiptPage;
