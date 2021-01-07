import React from 'react';
import BouncingDots from './BouncingDots';
import ChasingDots from './ChasingDots';
import CircleZoom from './CircleZoom';
import DoubleBounce from './DoubleBounce';
import MovingDots from './MovingDots';
import Overlay from './Overlay';
import ShiftingCube from './ShiftingCube';
import './style.scss';
import TwinDots from './TwinDots';

interface Props {
  style?:
    | 'moving-dots'
    | 'chasing-dots'
    | 'double-bounce'
    | 'shifting-cube'
    | 'circle-zoom'
    | 'twin-dots'
    | 'bouncing-dots';
}

const OakSpinner = (props: Props) => {
  return (
    <div className="oak-spinner">
      <Overlay />
      {props.style === 'moving-dots' && <MovingDots />}
      {props.style === 'chasing-dots' && <ChasingDots />}
      {props.style === 'double-bounce' && <DoubleBounce />}
      {props.style === 'shifting-cube' && <ShiftingCube />}
      {props.style === 'circle-zoom' && <CircleZoom />}
      {props.style === 'twin-dots' && <TwinDots />}
      {props.style === 'bouncing-dots' && <BouncingDots />}
    </div>
  );
};

export default OakSpinner;
