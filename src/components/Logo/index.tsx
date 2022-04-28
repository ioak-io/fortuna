import React, { useEffect, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import './style.scss';
import fortunaWhiteSmall from '../../images/fortuna_white_small.svg';
import fortunaWhiteText from '../../images/fortuna_white_text.svg';
import fortunaBlackSmall from '../../images/fortuna_black_small.svg';
import fortunaBlackText from '../../images/fortuna_black_text.svg';
import fortunaBlack from '../../images/fortuna_black.svg';

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
          <img src={fortunaWhiteSmall} alt="Fortuna logo" />
        )}
        {profile.theme !== 'theme_light' && (
          <img src={fortunaWhiteSmall} alt="Fortuna logo" />
        )}
      </div>
      {props.variant === 'full' && (
        <div className="logo--text">
          <img src={fortunaWhiteText} alt="Fortuna logo" />
        </div>
      )}
    </div>
  );
};

export default Logo;
