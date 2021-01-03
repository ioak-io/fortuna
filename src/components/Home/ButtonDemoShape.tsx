import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OakButton from '../../oakui/OakButton';
import ButtonContainer from './ButtonContainer';

const ButtonDemoShape = () => {
  const dummyAction = () => {
    console.log('button clicked');
  };

  return (
    <ButtonContainer align="left">
    <OakButton
      action={dummyAction}
      theme="primary"
      variant="regular"
      shape="sharp"
    >
      Sharp
    </OakButton>
      <OakButton
        action={dummyAction}
        theme="primary"
        variant="regular"
        shape="rectangle"
      >
        Rectangle
      </OakButton>
      <OakButton
        action={dummyAction}
        theme="primary"
        variant="regular"
        shape="rounded"
      >
        Rounded
      </OakButton>
      <OakButton
        action={dummyAction}
        theme="primary"
        variant="regular"
        shape="leaf"
      >
        Leaf shape
      </OakButton>
      <OakButton
        action={dummyAction}
        theme="primary"
        variant="regular"
        shape="icon"
      >
        <i className="material-icons">blur_on</i>
      </OakButton>
    </ButtonContainer>
  );
};

export default ButtonDemoShape;
