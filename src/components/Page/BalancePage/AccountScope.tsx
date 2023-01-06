import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import OakInput from '../../../oakui/wc/OakInput';

import './AccountScope.scss';
import ReceiptModel from '../../../model/ReceiptModel';
import { FORTUNA_PREF_ADDBILL_DATE } from '../../../constants/SessionStorageConstants';
import AccountScopeModel from '../../../model/AccountScopeModel';
import OakSelect from '../../../oakui/wc/OakSelect';

interface Props {
  data: AccountScopeModel;
  handleChange: any;
  formId: string;
}

const AccountScope = (props: Props) => {
  const handleChange = (detail: any) => {
    props.handleChange({ ...props.data, [detail.name]: detail.value });
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
    <div className="account-scope">
      <div className="page-title">Applicable time range</div>
      <div className="account-scope__form form">
        <div className="form-two-column">
          <OakSelect
            name="scope"
            value={props.data.scope}
            options={[
              'This month',
              'Last month',
              'This year',
              'Last year',
              'Custom',
            ]}
            formGroupName={props.formId}
            handleInput={handleChange}
            color="container"
            popupColor="surface"
            label="Scope"
          />
          <div />
          {props.data.scope === 'Custom' && (
            <>
              <OakInput
                type="date"
                name="from"
                value={props.data.from}
                formGroupName={props.formId}
                handleInput={handleChange}
                label="From"
              />
              <OakInput
                type="date"
                name="to"
                value={props.data.to}
                formGroupName={props.formId}
                handleInput={handleChange}
                label="To"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountScope;
