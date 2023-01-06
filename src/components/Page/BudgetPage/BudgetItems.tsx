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

import './BudgetItems.scss';
import OakSelect from '../../../oakui/wc/OakSelect';
import ExpenseModel from '../../../model/ExpenseModel';
import BudgetModel from '../../../model/BudgetModel';

interface Props {
  data: BudgetModel[];
  year: number;
  handleChange: any;
  formId: string;
}

const BudgetItems = (props: Props) => {
  const categories = useSelector((state: any) => state.category.categories);
  const [budgetMap, setBudgetMap] = useState<any>({});

  useEffect(() => {
    const _budgetMap: any = {};

    props.data.forEach((item) => {
      _budgetMap[`${item.month}-${item.categoryId}`] = item;
    });

    setBudgetMap(_budgetMap);
  }, [props.data]);

  const handleChange = (detail: any, record: any, monthNumber: number) => {
    const _data = [...props.data];
    const index = _data.findIndex(
      (item) => item.categoryId === record._id && item.month === monthNumber
    );
    if (index > -1) {
      _data[index] = { ..._data[index], amount: detail.value };
    } else {
      _data.push({
        year: props.year,
        month: monthNumber,
        amount: detail.value,
        categoryId: record._id,
      });
    }
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
              <th>Category</th>
              <th>January</th>
              <th>February</th>
              <th>March</th>
              <th>April</th>
              <th>May</th>
              <th>June</th>
              <th>July</th>
              <th>August</th>
              <th>September</th>
              <th>October</th>
              <th>November</th>
              <th>December</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((record: any) => (
              <tr key={record._id}>
                <td>{record.name}</td>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((monthNumber) => (
                  <td>
                    <OakInput
                      name="amount"
                      type="number"
                      value={budgetMap[`${monthNumber}-${record._id}`]?.amount}
                      formGroupName={props.formId}
                      handleInput={(detail: any) =>
                        handleChange(detail, record, monthNumber)
                      }
                      size="small"
                      color="container"
                      // autofocus={props.data.length - 1 === index}
                      // minLength={
                      //   index === 0 || index !== props.data.length - 1 ? 1 : 0
                      // }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetItems;
