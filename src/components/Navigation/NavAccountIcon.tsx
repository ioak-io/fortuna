import React, { useEffect, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import './style.scss';

interface Props {
  logout: any;
  login: any;
}

const NavAccountIcon = (props: Props) => {
  const authorization = useSelector(state => state.authorization);
  return (
    <div
      className="nav-account-icon"
      onClick={authorization.isAuth ? props.logout : props.login}
    >
      {authorization.isAuth && (
        <div className="nav-account-icon--username">
        <div>{`${authorization.firstName} ${authorization.lastName}`}</div>
          <i className="material-icons">power_settings_new</i>
        </div>
      )}
      {!authorization.isAuth && <i className="material-icons">fingerprint</i>}
    </div>
  );
};

export default NavAccountIcon;
