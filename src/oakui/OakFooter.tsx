import React, { useState, useEffect } from 'react';
import './styles/oak-footer.scss';

interface Props {
  children?: any;
  align?: 'left' | 'right' | 'center';
}

const OakFooter = (props: Props) => {
  return (
    <div className={`oak-footer ${props.align || 'right'}`}>
      <div className="oak-footer--container">{props.children}</div>
    </div>
  );
};

export default OakFooter;
