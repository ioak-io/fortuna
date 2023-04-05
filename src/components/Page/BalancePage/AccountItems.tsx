/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Button } from 'basicui';

import './AccountItems.scss';
import AccountModel from '../../../model/AccountModel';

interface Props {
  data: AccountModel[];
  handleChange: any;
  handleClick: any;
  handleAddAccount: any;
  formId: string;
}

const AccountItems = (props: Props) => {
  const categories = useSelector((state: any) => state.category.categories);

  const handleChange = (event: any, record: any, index: number) => {
    const _data = [...props.data];
    _data[index] = { ..._data[index], [event.currentTarget.name]: event.currentTarget.value };
    props.handleChange(_data);
  };

  return (
    <div className="budget-items">
      <div className="budget-items__main">
        <table className="basicui-table">
          <thead>
            <tr>
              <th>Account name</th>
              <th>Account type</th>
              <th>Opening balance</th>
              <th>Closing balance</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {props.data.map((record: any, index: number) => (
              <tr key={record._id}>
                <td onClick={() => props.handleClick(index)}>
                  {record.name || '-'}
                </td>
                <td onClick={() => props.handleClick(index)}>{record.type}</td>
                <td>
                  <Input
                    name="opening"
                    type="number"
                    value={record.opening}
                    onInput={(event: any) =>
                      handleChange(event, record, index)
                    }
                  />
                </td>
                <td>
                  <Input
                    name="closing"
                    type="number"
                    value={record.closing}
                    onInput={(event: any) =>
                      handleChange(event, record, index)
                    }
                  />
                </td>
                <td>
                  {/* {index === props.data.length - 1 && (
                    <Button handleClick={props.handleAddAccount}>
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  )} */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountItems;
