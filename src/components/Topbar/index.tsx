import React, { useEffect, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';

import { getProfile, setProfile } from '../../actions/ProfileActions';

import './style.scss';

import Links from '../Navigation/Links';
import RightNav from './RightNav';
import ExpandIcon from './ExpandIcon';
import Logo from '../Logo';
import ChangeAsset from './ChangeAsset';

interface Props {
    space: string;
    cookies: any;
  //   location: any;
  //   match: any;
  hideSidebarOnDesktop?: boolean;
}

const Topbar = (props: Props) => {
  const authorization = useSelector(state => state.authorization);

  const profile = useSelector(state => state.profile);

  const dispatch = useDispatch();

  const toggleSidebar = () => {
    dispatch(setProfile({ ...profile, sidebar: !profile.sidebar }));
  };

  return (
    <div className="topbar">
      <div className="topbar--left">
        {authorization.isAuth && <div className={`${props.hideSidebarOnDesktop ? 'mobile-only' : ''}`}><ExpandIcon /></div>}
        {props.hideSidebarOnDesktop && <div className="desktop-only"><Logo /></div>}
        <div className="topbar--left--nav desktop-only">
          {/* <Links space={props.space}/> */}
          <ChangeAsset space={props.space} />
        </div>
        {/* <div className="mobile-only"><Logo /></div> */}
      </div>
      <div className="topbar--right">
        <RightNav cookies={props.cookies} />
      </div>
    </div>
  );
};

export default Topbar;
