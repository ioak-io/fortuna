import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import OakInput from '../../../oakui/wc/OakInput';

import './ScheduleReceiptDetails.scss';
import ReceiptModel from '../../../model/ReceiptModel';
import { FORTUNA_PREF_ADDBILL_DATE } from '../../../constants/SessionStorageConstants';
import ScheduleReceiptModel from '../../../model/ScheduleReceiptModel';
import OakSelect from '../../../oakui/wc/OakSelect';
import OakCheckbox from '../../../oakui/wc/OakCheckbox';

interface Props {
  receipt: ScheduleReceiptModel;
  handleChange: any;
  formId: string;
  errors: boolean;
}

const ScheduleReceiptDetails = (props: Props) => {
  const handleChange = (detail: any) => {
    props.handleChange({ ...props.receipt, [detail.name]: detail.value });
    if (detail.name === 'billDate') {
      sessionStorage.setItem(FORTUNA_PREF_ADDBILL_DATE, detail.value);
    }
  };

  return (
    <div className="schedule-receipt-details">
      <div className="page-title">Schedule</div>
      {props.errors && (
        <div className="schedule-receipt-details__error">
          <FontAwesomeIcon icon={faExclamationTriangle} /> Incomplete
          information
        </div>
      )}
      <div className="schedule-receipt-details__form form">
        <div className="form-two-column">
          <OakInput
            name="name"
            value={props.receipt.name}
            formGroupName={props.formId}
            handleInput={handleChange}
            size="small"
            color="container"
            label="Schedule name *"
            autofocus
          />
          <OakInput
            name="description"
            value={props.receipt.description}
            formGroupName={props.formId}
            handleInput={handleChange}
            size="small"
            color="container"
            label="Receipt description"
          />
          <OakSelect
            name="recurrence"
            value={props.receipt.recurrence}
            options={['Weekly', 'Monthly', 'Yearly', 'Once']}
            formGroupName={props.formId}
            handleInput={handleChange}
            size="small"
            color="container"
            popupColor="surface"
            label="Frequency *"
            required
          />
          <OakInput
            name="from"
            value={props.receipt.from}
            formGroupName={props.formId}
            type="date"
            handleInput={handleChange}
            size="small"
            color="container"
            label="Effective from *"
          />
          {props.receipt.recurrence !== 'Once' && (
            <OakInput
              name="to"
              value={props.receipt.to}
              formGroupName={props.formId}
              type="date"
              handleInput={handleChange}
              size="small"
              color="container"
              label="Effective till *"
            />
          )}
          {props.receipt.recurrence === 'Weekly' && (
            <OakSelect
              name="daysInWeek"
              value={props.receipt.daysInWeek}
              options={[
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
              ]}
              formGroupName={props.formId}
              handleInput={handleChange}
              size="small"
              color="container"
              popupColor="surface"
              label="Days *"
              multiple
            />
          )}
          {props.receipt.recurrence === 'Yearly' && (
            <OakSelect
              name="monthsInYear"
              value={props.receipt.monthsInYear}
              options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
              formGroupName={props.formId}
              handleInput={handleChange}
              size="small"
              color="container"
              popupColor="surface"
              label="Months *"
              multiple
            />
          )}
          {(props.receipt.recurrence === 'Monthly' ||
            props.receipt.recurrence === 'Yearly') && (
            <OakSelect
              name="daysInMonth"
              value={props.receipt.daysInMonth}
              options={[
                'Last day in month',
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                29,
                30,
                31,
              ]}
              formGroupName={props.formId}
              handleInput={handleChange}
              size="small"
              color="container"
              popupColor="surface"
              label="Days in month *"
              multiple
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleReceiptDetails;
