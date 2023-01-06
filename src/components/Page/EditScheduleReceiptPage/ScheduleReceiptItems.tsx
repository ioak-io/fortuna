import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addDays, format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { compose as tableCompose } from '@oakui/core-stage/style-composer/OakTableComposer';
import OakInput from '../../../oakui/wc/OakInput';

import './ScheduleReceiptItems.scss';
import OakSelect from '../../../oakui/wc/OakSelect';
import ExpenseModel from '../../../model/ExpenseModel';
import ScheduleReceiptItemModel from '../../../model/ScheduleReceiptItemModel';

interface Props {
  data: ScheduleReceiptItemModel[];
  handleChange: any;
  formId: string;
  errors: boolean[];
}

const ScheduleReceiptItems = (props: Props) => {
  const categories = useSelector((state: any) => state.category.categories);
  const [categoryMap, setCategoryMap] = useState<any[]>([]);

  useEffect(() => {
    if (categories) {
      const _categoryMap: any[] = [];
      categories.forEach((category: any) => {
        _categoryMap.push({ id: category._id, value: category.name });
      });
      setCategoryMap(_categoryMap);
    }
  }, [categories]);

  const handleChange = (detail: any, index: number) => {
    const _data = [...props.data];
    _data[index] = { ..._data[index], [detail.name]: detail.value };
    props.handleChange(_data, index === props.data.length - 1);
  };

  return (
    <div className="schedule-receipt-items">
      <div className="page-title">Line items</div>
      {props.errors.includes(true) && (
        <div className="schedule-receipt-items__error">
          <FontAwesomeIcon icon={faExclamationTriangle} /> Incomplete
          information
        </div>
      )}
      <div className="schedule-receipt-items__main">
        <table
          className={tableCompose({
            color: 'surface',
            dense: false,
          })}
        >
          <thead>
            <tr>
              <th className="indicator-column"> </th>
              <th>Category</th>
              <th>Description</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {props.data.map((record, index) => (
              <tr key={record._id || index}>
                <td className="indicator-column">
                  <div
                    className={`indicator ${
                      props.errors[index] ? 'indicator--error' : ''
                    }`}
                  />
                </td>
                <td>
                  <OakSelect
                    name="category"
                    autocomplete
                    value={record.category}
                    optionsAsKeyValue={categoryMap}
                    formGroupName={props.formId}
                    handleInput={(detail: any) => handleChange(detail, index)}
                    size="small"
                    color="container"
                    popupColor="surface"
                    // required={index === 0 || index !== props.data.length - 1}
                  />
                </td>
                <td>
                  <OakInput
                    name="description"
                    value={record.description}
                    formGroupName={props.formId}
                    handleInput={(detail: any) => handleChange(detail, index)}
                    size="small"
                    color="container"
                    // autofocus={props.data.length - 1 === index}
                    // minLength={
                    //   index === 0 || index !== props.data.length - 1 ? 1 : 0
                    // }
                  />
                </td>
                <td>
                  <OakInput
                    name="amount"
                    type="number"
                    value={record.amount}
                    formGroupName={props.formId}
                    handleInput={(detail: any) => handleChange(detail, index)}
                    size="small"
                    color="container"
                    // min={index === 0 || index !== props.data.length - 1 ? 1 : 0}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleReceiptItems;
