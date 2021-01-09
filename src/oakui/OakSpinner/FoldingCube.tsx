import React from 'react';
import './FoldingCube.scss';

const FoldingCube = () => {
  return (
    <div className="folding-cube">
      <div className="folding-cube--child folding-cube--1"></div>
      <div className="folding-cube--child folding-cube--2"></div>
      <div className="folding-cube--child folding-cube--4"></div>
      <div className="folding-cube--child folding-cube--3"></div>
    </div>
  );
};

export default FoldingCube;
