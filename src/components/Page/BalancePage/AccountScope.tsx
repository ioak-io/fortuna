import React, { useEffect, useState } from 'react';
import { Button, Input, Select, SelectPropsConverter } from 'basicui';

import './AccountScope.scss';
import AccountScopeModel from '../../../model/AccountScopeModel';

interface Props {
  data: AccountScopeModel;
  handleChange: any;
  formId: string;
}

const AccountScope = (props: Props) => {
  const handleChange = (event: any) => {
    console.log(event);
    props.handleChange({ ...props.data, [event.currentTarget.name]: event.currentTarget.value });
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
          <Select
            name="scope"
            value={[props.data.scope]}
            options={SelectPropsConverter.optionsFromSimpleList([
              'This month',
              'Last month',
              'This year',
              'Last year',
              'Custom',
            ])} onInput={handleChange}
            label="Scope"
          />
          <div />
          {props.data.scope === 'Custom' && (
            <>
              <Input
                type="date"
                name="from"
                value={props.data.from}
                onInput={handleChange}
                label="From"
              />
              <Input
                type="date"
                name="to"
                value={props.data.to}
                onInput={handleChange}
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
