import React, { useEffect, useRef, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import { Chart, ArcElement, DoughnutController } from 'chart.js';
import './style.scss';
// import Chart from 'chart.js';
// import { Chart as ChartJS } from 'chart.js';
import { newId } from '../../../events/MessageService';

Chart.register(DoughnutController, ArcElement);

interface Props {
  title?: string;
  stacked?: boolean;
  // datasets: any;
  categoryLabels?: string[];
}

const CategoryDistribution = (props: Props) => {
  const chartRef = useRef(null);
  const [refId, setRefId] = useState(newId());
  const profile = useSelector((state: any) => state.profile);

  useEffect(() => {
    renderChart();
  }, []);

  // useEffect(() => {
  //   renderChart();
  // }, [props.datasets]);

  const renderChart = () => {
    const el: any = document.getElementById(refId);
    if (el) {
      new Chart(el, {
        type: 'doughnut',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [
            {
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                '#C6D57E',
                '#D57E7E',
                '#A2CDCD',
                '#FFE1AF',
                '#92BA92',
                '#F68989',
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          cutout: '80%',
        },
      });
    }
  };

  return (
    <div className="category-distribution">
      <canvas
        id={refId}
        ref={chartRef}
        // height={height}
        // width={width}
      />
    </div>
  );
};

export default CategoryDistribution;
