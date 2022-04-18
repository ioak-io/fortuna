import React, { useEffect, useRef, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import { Chart, ArcElement, DoughnutController, Legend } from 'chart.js';
import './style.scss';
// import Chart from 'chart.js';
// import { Chart as ChartJS } from 'chart.js';
import { newId } from '../../../events/MessageService';
import ChartHeader from '../ChartHeader';
import ChartBody from '../ChartBody';

Chart.register(DoughnutController, ArcElement, Legend);

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
  const [chart, setChart] = useState<any>(null);

  useEffect(() => {
    console.log(profile.sidebar, '***');
    setTimeout(() => {
      renderChart();
    }, 250);
  }, [profile.sidebar]);

  // useEffect(() => {
  //   renderChart();
  // }, [props.datasets]);

  const renderChart = () => {
    const el: any = document.getElementById(refId);
    if (el) {
      if (chart) {
        chart.destroy();
      }
      const _chart = new Chart(el, {
        type: 'doughnut',
        data: {
          labels: ['Grocery', 'Restaurant', 'Yellow'],
          datasets: [
            {
              label: 'My First Dataset',
              data: [300, 50, 100, 200, 225],
              backgroundColor: [
                '#8CA685',
                '#D9BB25',
                '#BF9A2C',
                '#F2E6CE',
                '#6393A6',
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          // responsive: true,
          // maintainAspectRatio: true,
          cutout: '80%',
          plugins: {
            legend: {
              display: false,
              position: 'right',
              labels: {
                padding: 20,
              },
            },
          },
        },
      });
      setChart(_chart);
    }
  };

  return (
    <div className="chart-section">
      <ChartHeader title="Category distribution" />
      <ChartBody>
        <div className="chart-section-main">
          <div className="category-distribution__chart">
            <canvas id={refId} ref={chartRef} />
          </div>
          <div className="category-distribution__legend">Legend</div>
        </div>
      </ChartBody>
    </div>
  );
};

export default CategoryDistribution;
