import React, { useEffect, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';

import { withRouter } from 'react-router';
import { withCookies } from 'react-cookie';
import { getProfile, setProfile } from '../../actions/ProfileActions';
import packetWhite from '../../images/expenso_white.svg';
import packetBlack from '../../images/expenso_black.svg';

import './style.scss';

import { Profile } from '../Types/GeneralTypes';
import { receiveMessage, sendMessage } from '../../events/MessageService';
import './style.scss';
import Header from './Header';
import NavElements from './NavElements';

const Sidebar = () => {
  const [space, setSpace] = useState('');
  const authorization = useSelector(state => state.authorization);

  const profile = useSelector(state => state.profile);

  const dispatch = useDispatch();

  useEffect(() => {
    receiveMessage().subscribe(event => {
      if (event.name === 'spaceChange') {
        setSpace(event.data);
      }
    });
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar--header">
      <Header />
      </div>
      <div className="sidebar--nav desktop-only">
        <NavElements space={space} />
      </div>
      <div className="sidebar--nav mobile-only">
        <NavElements space={space} closeAfterRouteChange />
      </div>
    </div>
  );
};

export default Sidebar;
