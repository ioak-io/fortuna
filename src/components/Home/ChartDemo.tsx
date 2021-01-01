import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { receiveMessage } from '../../events/MessageService';
import OakChartBar from '../../oakui/OakChartBar';
import OakChartLine from '../../oakui/OakChartLine';
import OakTable from '../../oakui/OakTable';
import './ChartDemo.scss';

const ChartDemo = () => {
  const authorization = useSelector(state => state.authorization);
  const [show, setShow] = useState(true);
  useEffect(() => {
    receiveMessage().subscribe(message => {
      if (message.name === 'sidebar-toggled') {
        handleResize();
      }
    });
    window.addEventListener('resize', handleResize);
    handleResize();
  }, []);

  const handleResize = () => {
    setTimeout(() => {
      setShow(false);
      setShow(true);
    }, 300)
  }

  const data = [
      {
        label: 'Sales',
        data: [86, 67, 91, 80],
        backgroundColor: "#dbf2f2d9",
        borderColor: "#61c8c8",
        // hoverBackgroundColor: "#61c8c870",
        showLine: true,
        cubicInterpolationMode: "monotone",
        borderWidth: 1
      },
      {
        label: 'Purchases',
        data: [36, 57, -90, -8],
        backgroundColor: "#ffe0e6c9",
        borderColor: "#ff8ca4",
        borderWidth: 1
      },
    ]

  const dataPoint = [
      {
        label: 'Sales',
        data: [{x: 10, y: 86}, {x: 20, y: 67}, {x: 50, y: 91}, {x: 60, y: 80}],
        backgroundColor: "rgba(255, 193, 94, 0.2)",
        borderColor: "#98B9AB",
        hoverBackgroundColor: "green",
        borderWidth: 1
      },
      {
        label: 'Purchases',
        data: [{x: 10, y: 100}, {x: 20, y: 10}, {x: 50, y: 20}, {x: 60, y: 100}],
        backgroundColor: "rgba(8, 3, 87, 0.2)",
        borderColor: "#98B9AB",
        hoverBackgroundColor: "green",
        borderWidth: 1
      },
      {
        label: 'Discounts',
        data: [{x: 10, y: 10}, {x: 20, y: 20}, {x: 50, y: 40}, {x: 60, y: -50}],
        backgroundColor: "rgba(80, 13, 7, 0.2)",
        borderColor: "#ffB0ff",
        hoverBackgroundColor: "green",
        borderWidth: 1
      }
    ]

  return (
    <div className="chart-demo">
      <div className="chart-demo-container" id="chart-demo-container">
      {/* <OakChartBar />
      <OakChartBar />
      <OakChartBar />
      <OakChartBar /> */}
      <div>{show && <OakChartBar datasets={data} type="category" categoryLabels= {['Jan', 'Feb', 'March', 'April']} stacked/>}</div>
      <div>{show && <OakChartBar datasets={data} type="category" categoryLabels= {['Jan', 'Feb', 'March', 'April']} />}</div>
      <div>{show && <OakChartLine datasets={data} type="category" categoryLabels= {['Jan', 'Feb', 'March', 'April']} stacked/>}</div>
      <div>{show && <OakChartLine datasets={data} type="category" categoryLabels= {['Jan', 'Feb', 'March', 'April']} />}</div>
      <div>{show && <OakChartLine datasets={dataPoint} type="linear" stacked/>}</div>
      <div>{show && <OakChartLine datasets={dataPoint} type="linear"/>}</div>
      </div>
    </div>
  );
};

export default ChartDemo;
