import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { compose as tableCompose } from '@oakui/core-stage/style-composer/OakTableComposer';

import './ListExpense.scss';
import OakTypography from '../../../oakui/wc/OakTypography';
import { getExpense } from './service';

interface Props {
  data?: any;
}

const ListExpense = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);

  const [data, setData] = useState<any[]>([]);

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
            <th>Kakeibo quadrant</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr>
              <td>{record.billDate}</td>
              <td>{record.category}</td>
              <td>{record.category}</td>
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
