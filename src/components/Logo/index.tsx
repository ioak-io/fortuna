import React, { useEffect, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import './style.scss';
import fortunaWhite from '../../images/fortuna_white.svg';
import fortunaBlack from '../../images/fortuna_black.svg';

const Logo = () => {
  const authorization = useSelector((state: any) => state.authorization);

  const profile = useSelector((state: any) => state.profile);

  const dispatch = useDispatch();

  return (
    <div className="logo">
      {profile.theme === 'theme_light' && (
        <img className="logo--image" src={fortunaWhite} alt="Fortuna logo" />
      )}
      {profile.theme !== 'theme_light' && (
        <img className="logo--image" src={fortunaWhite} alt="Fortuna logo" />
      )}
    </div>
  );
};

export default Logo;
