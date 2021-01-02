import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { receiveMessage } from '../../events/MessageService';
import OakChartBar from '../../oakui/OakChartBar';
import OakChartDoughnut from '../../oakui/OakChartDoughnut';
import OakChartLine from '../../oakui/OakChartLine';
import OakSection from '../../oakui/OakSection';
import OakTable from '../../oakui/OakTable';
import './ChartDemo.scss';

const ChartDemo = () => {
  const authorization = useSelector(state => state.authorization);
  const [show, setShow] = useState(true);
  useEffect(() => {
    receiveMessage().subscribe(message => {
      if (message.name === 'sidebar-toggled') {
        handleResize(400);
      }
    });
    window.addEventListener('resize', () => handleResize(0));
    handleResize(400);
  }, []);

  const handleResize = (delay: number) => {
    setTimeout(() => {
      setShow(false);
      setShow(true);
    }, delay);
  };

  const data = [
    {
      label: 'Sales',
      data: [86, 67, 91, 80],
      backgroundColor: '#dbf2f2d9',
      borderColor: '#61c8c8',
      // hoverBackgroundColor: "#61c8c870",
      showLine: true,
      cubicInterpolationMode: 'monotone',
      borderWidth: 1,
    },
    {
      label: 'Purchases',
      data: [36, 57, -90, -8],
      backgroundColor: '#ffe0e6c9',
      borderColor: '#ff8ca4',
      borderWidth: 1,
    },
  ];

  const dataPoint = [
    {
      label: 'Sales',
      data: [
        { x: 10, y: 86 },
        { x: 20, y: 67 },
        { x: 50, y: 91 },
        { x: 60, y: 80 },
      ],
      backgroundColor: 'rgba(255, 193, 94, 0.2)',
      borderColor: '#98B9AB',
      hoverBackgroundColor: 'green',
      borderWidth: 1,
    },
    {
      label: 'Purchases',
      data: [
        { x: 10, y: 100 },
        { x: 20, y: 10 },
        { x: 50, y: 20 },
        { x: 60, y: 100 },
      ],
      backgroundColor: 'rgba(8, 3, 87, 0.2)',
      borderColor: '#98B9AB',
      hoverBackgroundColor: 'green',
      borderWidth: 1,
    },
    {
      label: 'Discounts',
      data: [
        { x: 10, y: 10 },
        { x: 20, y: 20 },
        { x: 50, y: 40 },
        { x: 60, y: -50 },
      ],
      backgroundColor: 'rgba(80, 13, 7, 0.2)',
      borderColor: '#ffB0ff',
      hoverBackgroundColor: 'green',
      borderWidth: 1,
    },
  ];

  
  const doughnutData = [
    {
      label: 'Sales',
      data: [86, 67, 91, 80],
      backgroundColor: ['#2bf062d9', '#00f2f2d9', '#0bf002d9', '#d0f2f2d9'],
      borderColor: '#61c8c8',
      // hoverBackgroundColor: "#61c8c870",
      showLine: true,
      cubicInterpolationMode: 'monotone',
      borderWidth: 1,
    },
    {
      labels: 'Purchases',
      data: [36, 57, -90, -8],
      backgroundColor: ['#0bd062d9', '#0702f2d9', '#7b2002d9', '#20f0f2d9'],
      borderColor: '#ff8ca4',
      borderWidth: 1,
    },
  ];

  return (
    <div className="chart-demo">
      <div className="chart-demo-container" id="chart-demo-container">
        {/* <OakChartBar />
      <OakChartBar />
      <OakChartBar />
      <OakChartBar /> */}
        <div>
          {show && (
            <OakSection title="Doughnut chart - concentric">
              <OakChartDoughnut
                datasets={doughnutData}
                type="doughnut"
                categoryLabels={['Jan', 'Feb', 'March', 'April']}
                stacked
              />
            </OakSection>
          )}
        </div>
        <div>
          {show && (
            <OakSection subtitle="Doughnut chart">
              <OakChartDoughnut
                datasets={[doughnutData[1]]}
                type="doughnut"
                categoryLabels={['Jan', 'Feb', 'March', 'April']}
                stacked
              />
            </OakSection>
          )}
        </div>
        <div>
          {show && (
            <OakSection title="Piechart">
              <OakChartDoughnut
                datasets={[doughnutData[1]]}
                type="pie"
                categoryLabels={['Jan', 'Feb', 'March', 'April']}
                stacked
              />
            </OakSection>
          )}
        </div>
        <div>
          {show && (
            <OakSection
            title="Bar chart, by category - stacked">
              <OakChartBar
                datasets={data}
                type="category"
                categoryLabels={['Jan', 'Feb', 'March', 'April']}
                stacked
              />
            </OakSection>
          )}
        </div>
        <div>
          {show && (
            <OakSection
            title="Bar chart, by category">
              <OakChartBar
                datasets={data}
                type="category"
                categoryLabels={['Jan', 'Feb', 'March', 'April']}
              />
            </OakSection>
          )}
        </div>
        <div>
          {show && (
            <OakSection
            title="Line chart, by category - stacked">
              <OakChartLine
                datasets={data}
                type="category"
                categoryLabels={['Jan', 'Feb', 'March', 'April']}
                stacked
              />
            </OakSection>
          )}
        </div>
        <div>
          {show && (
            <OakSection
            title="Line chart, by category">
              <OakChartLine
                datasets={data}
                type="category"
                categoryLabels={['Jan', 'Feb', 'March', 'April']}
              />
            </OakSection>
          )}
        </div>
        <div>
          {show && (
            <OakSection
            title="Linear line chart - stacked">
              <OakChartLine
                datasets={dataPoint}
                type="linear"
                stacked
              />
            </OakSection>
          )}
        </div>
        <div>
          {show && (
            <OakSection
            title="Linear line chart">
              <OakChartLine
                datasets={dataPoint}
                type="linear"
              />
            </OakSection>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartDemo;
