import React, { useEffect, useRef, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import { Chart, ArcElement, DoughnutController, Legend } from 'chart.js';
import * as _ from 'lodash';
import './style.scss';
// import Chart from 'chart.js';
// import { Chart as ChartJS } from 'chart.js';
import { newId } from '../../../events/MessageService';
import ChartHeader from '../ChartHeader';
import ChartBody from '../ChartBody';
import StatisticsPayloadModel from '../../../model/StatisticsPayloadModel';
import { DASHBOARD_COLOR_SCHEME } from '../service';
import { formatCurrencyByCompanyDetail } from '../../../components/CurrencyUtils';
import { isEmptyAttributes } from '../../../components/Utils';
import ItemView from './ItemView';

interface Props {
  space: string;
  categoryMap: any;
  data: any;
  title: string;
}

const TopNSpendTrend = (props: Props) => {
  const chartRef = useRef(null);
  const [refId, setRefId] = useState(newId());
  const profile = useSelector((state: any) => state.profile);
  const authorization = useSelector((state: any) => state.authorization);
  const [chart, setChart] = useState<any>(null);
  const company = useSelector((state: any) =>
    state.company.items.find(
      (item: any) => item.reference === parseInt(props.space, 10)
    )
  );

  return (
    <div className="tile-section">
      <ChartHeader title={props.title} />
      <ChartBody>
        {props.data && (
          <div className="tile-section__main">
            <div className="tile-section__main__item tile-section__main__item--1">
              <ItemView
                space={props.space}
                title="Top spend"
                value={props.data.top1Spend.data}
                percent={props.data.top1Spend.percent}
              />
            </div>
            <div className="tile-section__main__item tile-section__main__item--2">
              <ItemView
                space={props.space}
                title="Top 5 spends"
                value={props.data.top5Spend.data}
                percent={props.data.top5Spend.percent}
              />
            </div>
            <div className="tile-section__main__item tile-section__main__item--3">
              <ItemView
                space={props.space}
                title="Top 10 spends"
                value={props.data.top10Spend.data}
                percent={props.data.top10Spend.percent}
              />
            </div>
            <div className="tile-section__main__item tile-section__main__item--4">
              <ItemView
                space={props.space}
                title="Top 25 spends"
                value={props.data.top25Spend.data}
                percent={props.data.top25Spend.percent}
              />
            </div>
            <div className="tile-section__main__item tile-section__main__item--5">
              <ItemView
                space={props.space}
                title="Top 50 spends"
                value={props.data.top50Spend.data}
                percent={props.data.top50Spend.percent}
              />
            </div>
            <div className="tile-section__main__item tile-section__main__item--6">
              <ItemView
                space={props.space}
                title="All spends"
                value={props.data.topAllSpend.data}
                percent={props.data.topAllSpend.percent}
              />
            </div>
          </div>
        )}
        {!props.data && <div>Loading...</div>}
      </ChartBody>
    </div>
  );
};

export default TopNSpendTrend;
