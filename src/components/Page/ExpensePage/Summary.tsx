import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { compose as tableCompose } from '@oakui/core-stage/style-composer/OakTableComposer';

import './Summary.scss';
import OakTypography from '../../../oakui/wc/OakTypography';
import { getExpense } from './service';

interface Props {
  data?: any;
}

const Summary = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);
  const categories = useSelector((state: any) => state.category.categories);

  const [data, setData] = useState<any[]>([]);
  const [categoryMap, setCategoryMap] = useState<any>({});

  useEffect(() => {
    if (authorization.isAuth) {
      getExpense('companyname', authorization).then((_data: any) => {
        setData(_data);
        console.log(_data);
      });
    }
  }, [authorization]);

  return (
    <div className="expense-summary">
      <div className="expense-summary__tab">
        <div className="expense-summary__tab__metric">6,200,000</div>
        <div className="expense-summary__tab__definition">Last year</div>
      </div>
      <div className="expense-summary__tab">
        <div className="expense-summary__tab__metric">67,800</div>
        <div className="expense-summary__tab__definition">This year</div>
      </div>
      <div className="expense-summary__tab">
        <div className="expense-summary__tab__metric">34,000</div>
        <div className="expense-summary__tab__definition">Last month</div>
      </div>
      <div className="expense-summary__tab">
        <div className="expense-summary__tab__metric">34,021</div>
        <div className="expense-summary__tab__definition">This month</div>
      </div>
      <div className="expense-summary__tab expense-summary__tab--active">
        <div className="expense-summary__tab__metric">20,100</div>
        <div className="expense-summary__tab__definition">Current filter</div>
      </div>
    </div>
  );
};

export default Summary;
