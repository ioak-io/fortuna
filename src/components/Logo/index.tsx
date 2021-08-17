import React, { useEffect, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import './style.scss';
import expensoWhite from '../../images/expenso_white.svg';
import expensoBlack from '../../images/expenso_black.svg';

const Logo = () => {
  const authorization = useSelector((state: any) => state.authorization);

  const profile = useSelector((state: any) => state.profile);

  const dispatch = useDispatch();

  return (
    <div className="logo">
      {profile.theme === 'theme_light' && (
        <img className="logo--image" src={expensoBlack} alt="Expenso logo" />
      )}
      {profile.theme !== 'theme_light' && (
        <img className="logo--image" src={expensoWhite} alt="Expenso logo" />
      )}
    </div>
  );
};

export default Logo;
