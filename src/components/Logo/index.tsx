import React, { useEffect, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import './style.scss';
import fortunaWhiteSmall from '../../images/fortuna_white_small.svg';
import fortunaWhiteText from '../../images/fortuna_white_text.svg';
import expensoBlack from '../../images/expenso_black.svg';

interface Props {
  variant: 'full' | 'short';
}

const Logo = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);

  const profile = useSelector((state: any) => state.profile);

  const dispatch = useDispatch();

  return (
    <div className="logo">
      <div className="logo--image">
        {profile.theme === 'theme_light' && (
          <img src={fortunaWhiteSmall} alt="Expenso logo" />
        )}
        {profile.theme !== 'theme_light' && (
          <img
            src={fortunaWhiteSmall}
            alt="Expenso logo"
          />
        )}
      </div>
      {props.variant === 'full' && <div className="logo--text">
        <img src={fortunaWhiteText} alt="Expenso logo" />
      </div>}
    </div>
  );
};

export default Logo;
