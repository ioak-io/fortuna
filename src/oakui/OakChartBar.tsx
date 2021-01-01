import React, { useEffect, useRef, useState } from 'react';
import './styles/OakChartBar.scss';
import Chart from 'chart.js';
import { newId, receiveMessage } from '../events/MessageService';
import { findStepSize } from './ChartUtils';

interface Props {
  stacked?: boolean;
  type: 'category';
  datasets: any;
  categoryLabels?: string[];
}

const OakChartBar = (props: Props) => {
  const chartRef = useRef(null);
  const [refId, setRefId] = useState(newId());

  useEffect(() => {
    renderChart(findStepSize(props.datasets, props.type, props.stacked));
  }, [props.datasets]);

  const renderChart = stepSize => {
    new Chart(document.getElementById(refId), {
      type: 'bar',
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
              stacked: props.stacked,
              type: props.type,
              labels: props.categoryLabels,
              barThickness: 20,
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
    <div className="oak-chart-bar">
      <canvas
        id={refId}
        ref={chartRef}
        // height={height}
        // width={width}
      />
    </div>
  );
};

export default OakChartBar;
