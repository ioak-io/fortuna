import React from 'react';
import OakHeading from '../../oakui/OakHeading';
import OakSection from '../../oakui/OakSection';
import ButtonDemo from './ButtonDemo';
import './style.scss';

interface Props {
  match: any;
  history: any;
}

const PlayButton = (props: Props) => {
  return (
    <>
      <OakSection outer>
        <OakHeading title="Button demo" />
      </OakSection>
      <ButtonDemo />
    </>
  );
};

export default PlayButton;
