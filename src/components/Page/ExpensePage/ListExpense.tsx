import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { compose as tableCompose } from '@oakui/core-stage/style-composer/OakTableComposer';

import './ListExpense.scss';
import OakTypography from '../../../oakui/wc/OakTypography';
import { getExpense } from './service';
import { format } from 'date-fns';

interface Props {
  data?: any;
}

const ListExpense = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);
  const categories = useSelector((state: any) => state.category.categories);

  const [data, setData] = useState<any[]>([]);
  const [categoryMap, setCategoryMap] = useState<any>({});

  useEffect(() => {
    if (categories) {
      const _categoryMap: any = {};
      categories.forEach((category: any) => {
        _categoryMap[category._id] = category;
      });
      setCategoryMap(_categoryMap);
    }
  }, [categories]);

  useEffect(() => {
    if (authorization.isAuth) {
      getExpense('companyname', authorization).then((_data: any) => {
        setData(_data);
        console.log(_data);
      });
    }
  }, [authorization]);

  return (
    <div className="list-expense">
      <table
        className={tableCompose({
          color: 'container',
          dense: true,
        })}
      >
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Kakeibo</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr>
              <td>{format(new Date(record.billDate), 'yyyy-MM-dd')}</td>
              <td>
                {categoryMap[record.category]
                  ? categoryMap[record.category].name
                  : ''}
              </td>
              <td>
                {categoryMap[record.category]
                  ? categoryMap[record.category].kakeibo
                  : ''}
              </td>
              <td>{record.description}</td>
              <td>{record.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListExpense;
