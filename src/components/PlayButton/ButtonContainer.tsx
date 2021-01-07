import React, { useState, useEffect } from 'react';
import './ButtonContainer.scss';

interface Props {
  children?: any;
  align?: 'left' | 'right' | 'center';
}

const ButtonContainer = (props: Props) => {
  return (
    <div className={`button-container ${props.align || 'right'}`}>
      <div className={`button-container--wrapper ${props.align || 'right'}`}>{props.children}</div>
    </div>
  );
};

export default ButtonContainer;
