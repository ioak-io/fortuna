import React, { useEffect, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// TODO Chart JS responsiveness does not work after 4.1.1 version
// https://github.com/chartjs/Chart.js/issues/11005

import {
  Chart,
  ArcElement,
  DoughnutController,
  Legend,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  TimeSeriesScale,
  Tooltip,
  BarController,
  BarElement,
  Filler,
} from 'chart.js';

import './style.scss';

import Notification from '../Notification';
import Init from './Init';
import TopbarContainer from './TopbarContainer';
import SidebarContainer from './SidebarContainer';
import BodyContainer from './BodyContainer';
import { receiveMessage } from '../../events/MessageService';
import OakNotification from '../../oakui/wc/OakNotification';
import OakAppLayout from '../../oakui/wc/OakAppLayout';
import MakeNavBarTransparentCommand from '../../events/MakeNavBarTransparentCommand';
import HideNavBarCommand from '../../events/HideNavBarCommand';
import MainContent from '../MainContent';
import Spinner from '../Spinner';
import { setProfile } from '../../store/actions/ProfileActions';
import { fetchAllSpaces } from '../../store/actions/SpaceActions';

Chart.register(
  DoughnutController,
  LineController,
  BarController,
  ArcElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  TimeSeriesScale,
  PointElement,
  LineElement,
  BarElement,
  Legend,
  Filler,
  Tooltip
);

interface Props {
}

const Content = (props: Props) => {
  const profile = useSelector((state: any) => state.profile);
  const authorization = useSelector((state: any) => state.authorization);
  const dispatch = useDispatch();
  const [usingMouse, setUsingMouse] = useState(false);
  const [space, setSpace] = useState('');
  const [transparentNav, setTransparentNav] = useState(false);
  const [hideNav, setHideNav] = useState(false);

  useEffect(() => {
    receiveMessage().subscribe((event) => {
      if (event.name === 'spaceChange') {
        setSpace(event.data);
      }
    });
  }, []);

  useEffect(() => {
    MakeNavBarTransparentCommand.asObservable().subscribe((message) => {
      setTransparentNav(message);
    });
    HideNavBarCommand.asObservable().subscribe((message) => {
      setHideNav(message);
    });
    receiveMessage().subscribe((message) => {
      if (message.name === 'usingMouse') {
        setUsingMouse(message.signal);
      }
    });

    dispatch(fetchAllSpaces());
  }, []);

  // useEffect(() => {
  //   Chart.defaults.global.defaultFontColor =
  //     profile.theme === 'theme_dark' ? '#e0e0e0' : '#626262';
  // }, [profile]);

  const handleClose = (detail: any) => {
    switch (detail.name) {
      case 'left':
        dispatch(setProfile({ ...profile, sidebar: !detail.value }));
        break;
      case 'right':
        dispatch(setProfile({ ...profile, rightSidebar: !detail.value }));
        break;
      default:
        break;
    }
  };

  return (
    <div className={`App ${profile.theme} ${profile.textSize}`}>
      <HashRouter>
        <Init />
        <Spinner />
        {/* <Notification /> */}
        {/* <OakNotification
            indicator="fill"
            outlined
            rounded
            elevation={5}
            displayCount={5}
          /> */}

        {/* <OakAppLayout
            topbarVariant="auto"
            sidebarVariant="none"
            topbarColor="custom"
            topbarElevation={0}
            sidebarElevation={2}
            sidebarToggleIconVariant="chevron"
          > */}
        {/* <div slot="sidebar">
              <SidebarContainer />
            </div> */}
        {/* <div slot="toolbar">
              <TopbarContainer cookies={props.cookies} />
            </div> */}
        {/* <div slot="main"> */}
        {/* <TopbarContainer cookies={props.cookies} /> */}
        {/* {!hideNav && (
                <NavigationContainer
                  cookies={props.cookies}
                  space={space}
                  transparent={transparentNav}
                />
              )}
              <BodyContainer {...props} /> */}
        <MainContent space={space} />
        {/* </div> */}
        {/* </OakAppLayout> */}
      </HashRouter>
    </div>
  );
};

export default Content;
