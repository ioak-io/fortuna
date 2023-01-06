import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProfile } from '../../store/actions/ProfileActions';
import './style.scss';

interface Props {
  title: string;
  children?: any;
}

const Topbar = (props: Props) => {
  const dispatch = useDispatch();
  const profile = useSelector((state: any) => state.profile);

  const toggleSidebar = () => {
    sessionStorage.setItem(
      'fortuna_pref_sidebar_status',
      profile.sidebar ? 'collapsed' : 'expanded'
    );

    dispatch(setProfile({ ...profile, sidebar: !profile.sidebar }));
  };

  return (
    <div className="topbar">
      <div className="topbar__left">
        <button className="button" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div>{props.title}</div>
      </div>
      <div className="topbar__right">{props.children}</div>
    </div>
  );
};

export default Topbar;
