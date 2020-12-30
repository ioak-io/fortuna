import React, { useState, useEffect } from 'react';
import './styles/oak-form.scss';

interface Props {
  children?: any;
}

const OakForm = (props: Props) => {
  return (
    <div className="oak-form">
      <div className="oak-form--container">{props.children}</div>
    </div>
  );
};

export default OakForm;
