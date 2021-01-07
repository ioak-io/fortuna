import React from 'react';
import OakHeading from '../../oakui/OakHeading';
import OakSection from '../../oakui/OakSection';
import ChartDemo from './ChartDemo';
import './style.scss';

interface Props {
  match: any;
  history: any;
}

const PlayChart = (props: Props) => {
  return (
    <>
      <OakSection outer>
        <OakHeading title="Chart" />
      </OakSection>
      <ChartDemo />
    </>
  );
};

export default PlayChart;
