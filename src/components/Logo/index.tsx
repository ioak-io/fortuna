import React, { useEffect, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import './style.scss';
import irWhite from '../../images/expenso_white.svg';
import irBlack from '../../images/expenso_black.svg';

const Logo = () => {
  const authorization = useSelector(state => state.authorization);

  const profile = useSelector(state => state.profile);

  const dispatch = useDispatch();

  return (
    <div className="logo">
        <img className="logo--image" src={irWhite} alt="Infinite reserve logo" />
    </div>
  );
};

export default Logo;
