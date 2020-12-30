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
import { removeAuth } from '../../actions/AuthActions';
import NavPopover from './NavPopover';
import NavMenuIcon from './NavMenuIcon';
import Links from './Links';
import NavAccountIcon from './NavAccountIcon';
import DarkModeIcon from './DarkModeIcon';
// import menuBg from '../../images/video.mp4';

interface Props {
  sendEvent: Function;
  getAuth: Function;
  addAuth: Function;
  removeAuth: Function;
  getProfile: Function;
  setProfile: Function;
  profile: Profile;
  login: Function;
  transparent: boolean;
  toggleSettings: any;
  history: any;
  cookies: any;
  location: any;
  match: any;
}

const Navigation = (props: Props) => {
  const [data, setData] = useState({
    visible: false,
    mobilemenu: 'hide',
    chooseTheme: false,
    showSettings: false,
    transparentNavBar: false,
    firstLoad: true,
  });

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const authorization = useSelector(state => state.authorization);

  const profile = useSelector(state => state.profile);

  const dispatch = useDispatch();

  const [space, setSpace] = useState('');

  useEffect(() => {
    receiveMessage().subscribe(event => {
      if (event.name === 'spaceChange') {
        setSpace(event.data);
      }
    });
  }, []);

  useEffect(() => {
    props.getProfile();
  }, []);

  useEffect(() => {
    receiveMessage().subscribe(message => {
      if (message.name === 'navbar-transparency') {
        setData({ ...data, transparentNavBar: message.signal });
      }
      if (message.name === 'loggedin') {
        // props.reloadProfile(nextProps.authorization);
        setData({ ...data, firstLoad: false });
      }
    });
  }, []);

  useEffect(() => {
    if (data.firstLoad && authorization && authorization.isAuth) {
      setData({ ...data, firstLoad: false });
    }
  }, [authorization.isAuth]);

  const logout = (
    event: any,
    type = 'success',
    message = 'You have been logged out'
  ) => {
    dispatch(removeAuth());
    props.cookies.remove(`expenso_${process.env.REACT_APP_ONEAUTH_APPSPACE_ID}`);
    props.history.push(`/`);
    setIsPopoverOpen(false);
    sendMessage('notification', true, {
      type,
      message,
      duration: 3000,
    });
  };

  const toggleDarkMode = () => {
    if (props.profile.theme === 'theme_dark') {
      props.setProfile({
        ...props.profile,
        theme: 'theme_light',
      });
    } else {
      props.setProfile({
        ...props.profile,
        theme: 'theme_dark',
      });
    }
  };

  const login = type => {
    // props.history.push(`/${asset}/login/home`);
    window.location.href = `${process.env.REACT_APP_ONEAUTH_URL}/#/appspace/${process.env.REACT_APP_ONEAUTH_APPSPACE_ID}/login?type=signin&appId=${process.env.REACT_APP_ONEAUTH_APP_ID}`;
    setIsPopoverOpen(false);
    // window.location.href = `${process.env.REACT_APP_ONEAUTH_URL}/#/space/${asset}/login?type=${type}&appId=${process.env.REACT_APP_ONEAUTH_APP_ID}`;
  };

  const toggleSettings = () => {
    setData({ ...data, showSettings: !data.showSettings });
  };

  return (
    <>
      <div
        className={`${
          isPopoverOpen
            ? 'nav-header nav-header-expanded'
            : 'nav-header nav-header-collapsed'
        }`}
      >
        <div className="nav-header-container">
          <div className="nav-header-container--left">
            <div onClick={() => props.history.push("/")}>
              {profile.theme === 'theme_light' && (
                <img className="logo" src={packetBlack} alt="Packet logo" />
              )}
              {profile.theme === 'theme_dark' && (
                <img className="logo" src={packetWhite} alt="Packet logo" />
              )}
            </div>
            <div className="desktop-only">
              <Links space={space} />
            </div>
          </div>
          <div className="nav-header-container--right">
            <DarkModeIcon />
            <NavAccountIcon logout={logout} login={login} />
            <div className="mobile-only">
              <NavMenuIcon
                showClose={isPopoverOpen}
                handleClick={() => setIsPopoverOpen(!isPopoverOpen)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={`nav ${isPopoverOpen ? 'active' : 'inactive'}`}>
        <div className="nav-after">
          <div
            className={`nav-container ${isPopoverOpen ? 'active' : 'inactive'}`}
          >
            {/* <video className="videoTag" autoPlay loop muted>
              <source src={menuBg} type="video/mp4" />
            </video> */}
            <NavPopover
              space={space}
              handleClose={() => setIsPopoverOpen(false)}
              logout={logout}
              login={login}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfile, setProfile })(
  withCookies(withRouter(Navigation))
);
