import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OakButton from '../../oakui/OakButton';
import ButtonContainer from './ButtonContainer';
import './ButtonDemo.scss';

interface Props {
  theme: 'default' | 'primary' | 'secondary' | 'tertiary' | 'info' | 'danger' | 'warning' | 'success';
}

const ButtonDemoContrast = (props: Props) => {
  const dummyAction = () => {
    console.log('button clicked');
  };

  return (
    <ButtonContainer align="left">
      <OakButton
        action={dummyAction}
        theme={props.theme}
        variant="appear"
        shape="rectangle"
      >
        Appear
      </OakButton>
      <OakButton
        action={dummyAction}
        theme={props.theme}
        variant="disappear"
        shape="rectangle"
      >
        Disappear
      </OakButton>
      <OakButton
        action={dummyAction}
        theme={props.theme}
        variant="regular"
        shape="rectangle"
      >
        Regular
      </OakButton>
      <OakButton
        action={dummyAction}
        theme={props.theme}
        variant="drama"
        shape="rectangle"
      >
        Drama
      </OakButton>
      <OakButton
        action={dummyAction}
        theme={props.theme}
        variant="block"
        shape="rectangle"
      >
        Block
      </OakButton>
      <OakButton
        action={dummyAction}
        theme={props.theme}
        variant="outline"
        shape="rectangle"
      >
        Outline
      </OakButton>
      <OakButton
        action={dummyAction}
        theme={props.theme}
        variant="disabled"
        shape="rectangle"
      >
        Disabled
      </OakButton>
    </ButtonContainer>
  );
};

export default ButtonDemoContrast;
