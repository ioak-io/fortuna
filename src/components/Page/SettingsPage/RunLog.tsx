/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCompressAlt,
  faExclamationTriangle,
  faExpandAlt,
  faFileExport,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { compose } from '@oakui/core-stage/style-composer/OakTableComposer';
import OakInput from '../../../oakui/wc/OakInput';

import './RunLog.scss';
import ReceiptModel from '../../../model/ReceiptModel';
import { EXPENSO_PREF_ADDBILL_DATE } from '../../../constants/SessionStorageConstants';
import ScheduleReceiptModel from '../../../model/ScheduleReceiptModel';
import OakSelect from '../../../oakui/wc/OakSelect';
import OakCheckbox from '../../../oakui/wc/OakCheckbox';
import OakButton from '../../../oakui/wc/OakButton';
import { deleteTransactions, getLog } from './service';

interface Props {
  // receipt: ScheduleReceiptModel;
  data: any[];
  space: string;
  handleChange: any;
}

const RunLog = (props: Props) => {
  const history = useHistory();
  const authorization = useSelector((state: any) => state.authorization);
  // const [data, setData] = useState<any[]>([]);
  const [denseView, setDenseView] = useState(true);

  const openRecord = (record: any) => {};

  const deleteTransaction = (record: any) => {
    deleteTransactions(props.space, record.transactionId, authorization).then(
      (response: any) => {
        props.handleChange(
          props.data.filter((item: any) => item._id !== record._id)
        );
      }
    );
  };

  const exportTransaction = (record: any) => {};

  return (
    <div className="backup-runlog">
      <div className="page-title">
        <div>Import log</div>
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
      <div className="backup-runlog__main">
        <table
          className={compose({
            color: 'surface',
            dense: denseView,
          })}
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Receipts</th>
              <th>Line items</th>
              <th>Categories</th>
              <th>Tags</th>
              <th>Transaction amount</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {props.data?.map((record: any) => (
              <tr key={record._id}>
                <td onClick={() => openRecord(record)}>
                  {record.transactionDate}
                </td>
                <td onClick={() => openRecord(record)}>{record.receipts}</td>
                <td onClick={() => openRecord(record)}>{record.lineItems}</td>
                <td onClick={() => openRecord(record)}>
                  {record.categoryCount}
                </td>
                <td onClick={() => openRecord(record)}>{record.tagCount}</td>
                <td onClick={() => openRecord(record)}>{record.total}</td>
                <td className="action-column">
                  <button
                    className="button backup-runlog__main__delete-button"
                    onClick={() => deleteTransaction(record)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    className="button backup-runlog__main__export-button"
                    onClick={() => exportTransaction(record)}
                  >
                    <FontAwesomeIcon icon={faFileExport} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RunLog;
