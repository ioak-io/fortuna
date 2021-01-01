import React, { useEffect, useRef, useState } from 'react';
import './styles/OakChartLine.scss';
import Chart from 'chart.js';
import { newId, receiveMessage } from '../events/MessageService';
import { findStepSize } from './ChartUtils';

interface Props {
  stacked?: boolean;
  type: 'linear' | 'category';
  datasets: any;
  categoryLabels?: string[];
}

const OakChartLine = (props: Props) => {
  const chartRef = useRef(null);
  const [refId, setRefId] = useState(newId());

  useEffect(() => {
    renderChart(findStepSize(props.datasets, props.type, props.stacked));
  }, [props.datasets]);

  const renderChart = stepSize => {
    new Chart(document.getElementById(refId), {
      type: 'line',
      data: { datasets: props.datasets },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        //Customize chart options
        scales: {
          yAxes: [
            {
              stacked: props.stacked,
              gridLines: {
              },
              ticks: {
                stepSize: stepSize,
              },
            },
          ],
          xAxes: [
            {
              type: props.type,
              labels: props.categoryLabels,
              gridLines: {
                display: false,
              },
            },
          ],
        },
      },
    });
  };

  return (
    <div className="oak-chart-line">
      <canvas
        id={refId}
        ref={chartRef}
        // height={height}
        // width={width}
      />
    </div>
  );
};

export default OakChartLine;
