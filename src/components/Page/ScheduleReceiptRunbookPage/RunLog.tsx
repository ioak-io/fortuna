/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCompressAlt,
  faExclamationTriangle,
  faExpandAlt,
} from '@fortawesome/free-solid-svg-icons';
import { compose } from '@oakui/core-stage/style-composer/OakTableComposer';
import OakInput from '../../../oakui/wc/OakInput';

import './Details.scss';
import ReceiptModel from '../../../model/ReceiptModel';
import { FORTUNA_PREF_ADDBILL_DATE } from '../../../constants/SessionStorageConstants';
import ScheduleReceiptModel from '../../../model/ScheduleReceiptModel';
import OakSelect from '../../../oakui/wc/OakSelect';
import OakCheckbox from '../../../oakui/wc/OakCheckbox';
import OakButton from '../../../oakui/wc/OakButton';
import { deleteTransactions, getLog, repostTransactions } from './service';

interface Props {
  // receipt: ScheduleReceiptModel;
  data: any[];
  space: string;
}

const RunLog = (props: Props) => {
  const history = useHistory();
  const authorization = useSelector((state: any) => state.authorization);
  // const [data, setData] = useState<any[]>([]);
  const [denseView, setDenseView] = useState(true);

  const openRecord = (record: any) => {
    navigate(`/${props.space}/receipt/edit?id=${record.receiptId}`);
  };

  return (
    <div className="sch-rec-rb-runlog">
      <div className="page-title">
        <div>Transaction log</div>
        <div className="desktop-only">
          <OakButton
            theme="info"
            variant="regular"
            handleClick={() => {
              setDenseView(!denseView);
            }}
            size="small"
          >
            <FontAwesomeIcon icon={denseView ? faExpandAlt : faCompressAlt} />
          </OakButton>
        </div>
      </div>
      <div className="sch-rec-rb-runlog__main">
        <table
          className={compose({
            color: 'surface',
            dense: denseView,
          })}
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Line items</th>
              <th>Transaction amount</th>
            </tr>
          </thead>
          <tbody>
            {props.data?.map((record: any) => (
              <tr key={record._id}>
                <td onClick={() => openRecord(record)}>
                  {record.transactionDate}
                </td>
                <td onClick={() => openRecord(record)}>{record.lineItems}</td>
                <td onClick={() => openRecord(record)}>{record.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RunLog;
