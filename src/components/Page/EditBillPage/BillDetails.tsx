import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import OakInput from '../../../oakui/wc/OakInput';

import './BillDetails.scss';
import BillModel from '../../../model/BillModel';
import { EXPENSO_PREF_ADDBILL_DATE } from '../../../constants/SessionStorageConstants';

interface Props {
  bill: BillModel;
  handleChange: any;
  formId: string;
  errors: boolean;
}

const BillDetails = (props: Props) => {
  const handleChange = (detail: any) => {
    props.handleChange({ ...props.bill, [detail.name]: detail.value });
    if (detail.name === 'billDate') {
      sessionStorage.setItem(EXPENSO_PREF_ADDBILL_DATE, detail.value);
    }
  };

  // const save = () => {
  //   console.log('save');
  //   saveExpense(
  //     'companyname',
  //     { ...state, billDate: state.billDateString },
  //     authorization
  //   );
  //   QuickEditExpenseCommand.next(false);
  // };

  return (
    <div className="bill-details">
      <div className="page-title">Bill details</div>
      {props.errors && (
        <div className="bill-details__error">
          <FontAwesomeIcon icon={faExclamationTriangle} /> Incomplete
          information
        </div>
      )}
      <div className="bill-details__form form">
        <div className="form-two-column">
          <OakInput
            name="number"
            value={props.bill.number}
            formGroupName={props.formId}
            handleInput={handleChange}
            size="small"
            color="container"
            label="Bill number"
          />
          {/* <input autoFocus /> */}
          <OakInput
            name="billDate"
            value={props.bill.billDate}
            formGroupName={props.formId}
            type="date"
            handleInput={handleChange}
            size="small"
            color="container"
            label="Bill date *"
            autofocus
          />
          <OakInput
            name="description"
            value={props.bill.description}
            formGroupName={props.formId}
            handleInput={handleChange}
            size="small"
            color="container"
            label="Description"
          />
          <OakInput
            name="total"
            value={props.bill.total}
            formGroupName={props.formId}
            handleInput={handleChange}
            size="small"
            color="container"
            label="Total"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default BillDetails;
