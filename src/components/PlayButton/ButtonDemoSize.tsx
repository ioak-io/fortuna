import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OakButton from '../../oakui/OakButton';
import ButtonContainer from './ButtonContainer';

const ButtonDemoSize = () => {
  const dummyAction = () => {
    console.log('button clicked');
  };

  return (
    <ButtonContainer align="left">
      <OakButton
        action={dummyAction}
        theme="primary"
        variant="regular"
        size="large"
      >
        Large
      </OakButton>
      <OakButton
        action={dummyAction}
        theme="primary"
        variant="regular"
        size="medium"
      >
        Medium
      </OakButton>
      <OakButton
        action={dummyAction}
        theme="primary"
        variant="regular"
        size="small"
      >
        Small
      </OakButton>
      <OakButton
        action={dummyAction}
        theme="primary"
        variant="regular"
        size="xsmall"
      >
        Extra Small
      </OakButton>
    </ButtonContainer>
  );
};

export default ButtonDemoSize;
