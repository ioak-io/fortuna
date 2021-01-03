import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OakButton from '../../oakui/OakButton';
import ButtonContainer from './ButtonContainer';

const ButtonDemoIcon = () => {
  const dummyAction = () => {
    console.log('button clicked');
  };

  return (
    <>
      <ButtonContainer align="left">
        <OakButton
          action={dummyAction}
          theme="primary"
          variant="disappear"
          shape="rectangle"
          size="small"
        >
          <i className="material-icons">blur_on</i>
          Icon in button
        </OakButton>
        <OakButton
          action={dummyAction}
          theme="primary"
          variant="disappear"
          shape="rectangle"
          size="large"
        >
          <i className="material-icons">blur_on</i>
        </OakButton>
        <OakButton
          action={dummyAction}
          theme="primary"
          variant="disappear"
          shape="rectangle"
          size="medium"
        >
          <i className="material-icons">blur_on</i>
        </OakButton>
        <OakButton
          action={dummyAction}
          theme="primary"
          variant="disappear"
          shape="rectangle"
          size="small"
        >
          <i className="material-icons">blur_on</i>
        </OakButton>
        <OakButton
          action={dummyAction}
          theme="primary"
          variant="disappear"
          shape="rectangle"
          size="xsmall"
        >
          <i className="material-icons">blur_on</i>
        </OakButton>
        <OakButton
          action={dummyAction}
          theme="primary"
          variant="disappear"
          shape="icon"
          size="large"
        >
          <i className="material-icons">blur_on</i>
        </OakButton>
        <OakButton
          action={dummyAction}
          theme="primary"
          variant="disappear"
          shape="icon"
          size="medium"
        >
          <i className="material-icons">blur_on</i>
        </OakButton>
        <OakButton
          action={dummyAction}
          theme="primary"
          variant="disappear"
          shape="icon"
          size="small"
        >
          <i className="material-icons">blur_on</i>
        </OakButton>
        <OakButton
          action={dummyAction}
          theme="primary"
          variant="disappear"
          shape="icon"
          size="xsmall"
        >
          <i className="material-icons">blur_on</i>
        </OakButton>
      </ButtonContainer>
    </>
  );
};

export default ButtonDemoIcon;
