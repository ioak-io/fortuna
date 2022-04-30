/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addDays, format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faExclamationTriangle,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { compose as tableCompose } from '@oakui/core-stage/style-composer/OakTableComposer';
import OakInput from '../../../oakui/wc/OakInput';

import './AccountItems.scss';
import OakSelect from '../../../oakui/wc/OakSelect';
import AccountModel from '../../../model/AccountModel';
import OakButton from '../../../oakui/wc/OakButton';

interface Props {
  data: AccountModel[];
  handleChange: any;
  handleClick: any;
  handleAddAccount: any;
  formId: string;
}

const AccountItems = (props: Props) => {
  const categories = useSelector((state: any) => state.category.categories);

  const handleChange = (detail: any, record: any, index: number) => {
    const _data = [...props.data];
    _data[index] = { ..._data[index], [detail.name]: detail.value };
    props.handleChange(_data);
  };

  return (
    <div className="budget-items">
      <div className="budget-items__main">
        <table
          className={tableCompose({
            color: 'surface',
            dense: false,
          })}
        >
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
                  <OakInput
                    name="opening"
                    type="number"
                    value={record.opening}
                    formGroupName={props.formId}
                    handleInput={(detail: any) =>
                      handleChange(detail, record, index)
                    }
                    size="small"
                    color="container"
                  />
                </td>
                <td>
                  <OakInput
                    name="closing"
                    type="number"
                    value={record.closing}
                    formGroupName={props.formId}
                    handleInput={(detail: any) =>
                      handleChange(detail, record, index)
                    }
                    size="small"
                    color="container"
                  />
                </td>
                <td>
                  {/* {index === props.data.length - 1 && (
                    <OakButton handleClick={props.handleAddAccount}>
                      <FontAwesomeIcon icon={faPlus} />
                    </OakButton>
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
