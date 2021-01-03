import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OakButton from '../../oakui/OakButton';
import ButtonContainer from './ButtonContainer';

const ButtonDemoVariant = () => {
  const dummyAction = () => {
    console.log('button clicked');
  };

  return (
    <ButtonContainer align="left">
      <OakButton
        action={dummyAction}
        theme="primary"
        variant="appear"
        shape="rectangle"
      >
        Appear
      </OakButton>
      <OakButton
        action={dummyAction}
        theme="primary"
        variant="disappear"
        shape="rectangle"
      >
        Disappear
      </OakButton>
      <OakButton
        action={dummyAction}
        theme="primary"
        variant="regular"
        shape="rectangle"
      >
        Regular
      </OakButton>
      <OakButton
        action={dummyAction}
        theme="primary"
        variant="drama"
        shape="rectangle"
      >
        Drama
      </OakButton>
      <OakButton
        action={dummyAction}
        theme="primary"
        variant="block"
        shape="rectangle"
      >
        Block
      </OakButton>
      <OakButton
        action={dummyAction}
        theme="primary"
        variant="outline"
        shape="rectangle"
      >
        Outline
      </OakButton>
      <OakButton
        action={dummyAction}
        theme="primary"
        variant="disabled"
        shape="rectangle"
      >
        Disabled
      </OakButton>
    </ButtonContainer>
  );
};

export default ButtonDemoVariant;
