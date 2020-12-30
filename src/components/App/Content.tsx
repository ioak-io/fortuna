import React, { useEffect, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';

import './style.scss';
import { HashRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { withCookies } from 'react-cookie';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { getUser, addUser } from '../../actions/UserActions';
import { getProfile, setProfile } from '../../actions/ProfileActions';

import Notification from '../Notification';
import Navigation from '../Navigation';
import { Authorization } from '../Types/GeneralTypes';
import { receiveMessage } from '../../events/MessageService';
import { fetchAllSpaces } from '../../actions/SpaceActions';
import Init from './Init';
import { fetchAllAssets } from '../../actions/AssetActions';
import RouterView from './RouterView';
import Sidebar from '../Sidebar';
import Topbar from '../Topbar';
import BookmarkBar from '../Topbar/BookmarkBar';

const themes = {
  themecolor1: getTheme('#69A7BF'),
  themecolor2: getTheme('#99587B'),
  themecolor3: getTheme('#A66C26'),
  themecolor4: getTheme('#37AE82'),
};

function getTheme(color: string) {

  return createMuiTheme({
    palette: {
      primary: {
        main: color,
      },
      secondary: {
        main: color,
      },
    },
  });
}

interface Props {
  getProfile: Function;
  setProfile: Function;
  getAuth: Function;
  addAuth: Function;
  removeAuth: Function;
  getUser: Function;
  addUser: Function;
  cookies: any;

  // event: PropTypes.object,
  profile: any;
  authorization: Authorization;
}

const Content = (props: Props) => {
  const authorization = useSelector(state => state.authorization);
  const profile = useSelector(state => state.profile);
  const [space, setSpace] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    receiveMessage().subscribe(event => {
      if (event.name === 'spaceChange') {
        setSpace(event.data);
      }
    });
  }, []);

  useEffect(() => {
    props.getProfile();
    dispatch(fetchAllSpaces());
    dispatch(fetchAllAssets());
  }, []);

  return (
    <div
      className={`App ${props.profile.theme} ${props.profile.textSize} ${props.profile.themeColor}`}
    >
      <HashRouter>
        <div className="app-container body">
          <Init />
          <Notification />
          <MuiThemeProvider theme={themes.themecolor1}>
            <div className={`app-container--sidebar ${profile.sidebar && authorization.isAuth ? 'show' : 'hide'}`}>
            <div className={`app-container--sidebar--content ${profile.hideSidebarOnDesktop ? 'mobile-only' : ''}`}>
                <Sidebar />
              </div>
            </div>
            <div className="app-container--main">
              <div className={`app-container--main--topbar ${profile.sidebar ? 'sidebar-shown' : 'sidebar-hidden'}`}>
                {/* <Navigation {...props} /> */}
                <Topbar space={space} cookies={props.cookies} hideSidebarOnDesktop={profile.hideSidebarOnDesktop} />
              </div>
              <div className={`app-container--main--body ${profile.sidebar ? 'sidebar-shown' : 'sidebar-hidden'}`}>
                <RouterView {...props}/>
              </div>
            </div>
          </MuiThemeProvider>
        </div>
      </HashRouter>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  profile: state.profile, // ,
  //   event: state.event
});

export default connect(mapStateToProps, {
  getProfile,
  setProfile,
  getUser,
  addUser,
})(withCookies(Content));
