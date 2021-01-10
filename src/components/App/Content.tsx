import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Chart from 'chart.js';

import './style.scss';
import { HashRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { withCookies } from 'react-cookie';

import Notification from '../Notification';
import { fetchAllSpaces } from '../../actions/SpaceActions';
import Init from './Init';
import { fetchAllAssets } from '../../actions/AssetActions';
import TopbarContainer from './TopbarContainer';
import SidebarContainer from './SidebarContainer';
import BodyContainer from './BodyContainer';
import { receiveMessage } from '../../events/MessageService';

interface Props {
  cookies: any;
}

const Content = (props: Props) => {
  const profile = useSelector(state => state.profile);
  const dispatch = useDispatch();
  const [usingMouse, setUsingMouse] = useState(false);

  useEffect(() => {

    receiveMessage().subscribe(message => {
      if (message.name === 'usingMouse') {
        setUsingMouse(message.signal);
      }
    })

    dispatch(fetchAllSpaces());
    dispatch(fetchAllAssets());
  }, []);

  useEffect(() => {
    Chart.defaults.global.defaultFontColor =
      profile.theme === 'theme_dark' ? '#e0e0e0' : '#626262';
  }, [profile]);

  return (
    <div
      className={`App ${profile.theme} ${profile.textSize} ${profile.themeColor} ${usingMouse ? 'using-mouse' : ''}`}
    >
      <HashRouter>
        <Init />
        <Notification />
        <TopbarContainer cookies={props.cookies} />
        <SidebarContainer />
        <BodyContainer {...props} />
      </HashRouter>
    </div>
  );
};

export default withCookies(Content);
