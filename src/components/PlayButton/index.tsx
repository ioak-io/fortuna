import React from 'react';
import OakHeading from '../../oakui/OakHeading';
import OakCard from '../../oakui/OakCard';
import ButtonDemo from './ButtonDemo';
import './style.scss';

interface Props {
  match: any;
  history: any;
}

const PlayButton = (props: Props) => {
  return (
    <>
      <OakHeading title="Button demo" />
      <ButtonDemo />
    </>
  );
};

export default PlayButton;
