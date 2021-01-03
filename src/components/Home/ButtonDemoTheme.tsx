import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OakButton from '../../oakui/OakButton';
import ButtonContainer from './ButtonContainer';

const ButtonDemoTheme = () => {
  const dummyAction = () => {
    console.log('button clicked');
  };

  return (
    <ButtonContainer align="left">
      <OakButton
        action={dummyAction}
        theme="primary"
        variant="regular"
        shape="rectangle"
      >
        Primary
      </OakButton>
      <OakButton
        action={dummyAction}
        theme="secondary"
        variant="regular"
        shape="rectangle"
      >
        Secondary
      </OakButton>
      <OakButton
        action={dummyAction}
        theme="tertiary"
        variant="regular"
        shape="rectangle"
      >
        Tertiary
      </OakButton>
      <OakButton
        action={dummyAction}
        theme="default"
        variant="regular"
        shape="rectangle"
      >
        Default
      </OakButton>
      <OakButton
        action={dummyAction}
        theme="danger"
        variant="regular"
        shape="rectangle"
      >
        Danger
      </OakButton>
      <OakButton
        action={dummyAction}
        theme="warning"
        variant="regular"
        shape="rectangle"
      >
        Warning
      </OakButton>
      <OakButton
        action={dummyAction}
        theme="success"
        variant="regular"
        shape="rectangle"
      >
        Success
      </OakButton>
      <OakButton
        action={dummyAction}
        theme="info"
        variant="regular"
        shape="rectangle"
      >
        Info
      </OakButton>
    </ButtonContainer>
  );
};

export default ButtonDemoTheme;
