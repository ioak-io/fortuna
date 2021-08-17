import React, { useEffect, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { InMemoryCache } from 'apollo-boost';
import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloProvider } from '@apollo/client';

import Chart from 'chart.js';

import './style.scss';
import { withCookies } from 'react-cookie';

import Notification from '../Notification';
import { fetchAllSpaces } from '../../actions/SpaceActions';
import Init from './Init';
import TopbarContainer from './TopbarContainer';
import SidebarContainer from './SidebarContainer';
import BodyContainer from './BodyContainer';
import { receiveMessage } from '../../events/MessageService';
import OakNotification from '../../oakui/wc/OakNotification';
import OakAppLayout from '../../oakui/wc/OakAppLayout';
import { setProfile } from '../../actions/ProfileActions';
import NavigationContainer from './NavigationContainer';
import MakeNavBarTransparentCommand from '../../events/MakeNavBarTransparentCommand';
import HideNavBarCommand from '../../events/HideNavBarCommand';

interface Props {
  cookies: any;
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

  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_URL,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `${space} ${authorization?.accessToken}` || '',
      },
    };
  });

  const client: any = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  useEffect(() => {
    Chart.defaults.global.defaultFontColor =
      profile.theme === 'theme_dark' ? '#e0e0e0' : '#626262';
  }, [profile]);

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
    <ApolloProvider client={client}>
      <div className={`App ${profile.theme} ${profile.textSize}`}>
        <HashRouter>
          <Init />
          {/* <Notification /> */}
          {/* <OakNotification
            indicator="fill"
            outlined
            rounded
            elevation={5}
            displayCount={5}
          /> */}

          <OakAppLayout
            topbarVariant="none"
            sidebarVariant="none"
            topbarColor="custom"
            topbarElevation={0}
            sidebarElevation={2}
            sidebarToggleIconVariant="chevron"
          >
            <div slot="sidebar">
              <SidebarContainer />
            </div>
            <div slot="toolbar">
              <TopbarContainer cookies={props.cookies} />
            </div>
            <div slot="main">
              {/* <TopbarContainer cookies={props.cookies} /> */}
              {!hideNav && (
                <NavigationContainer
                  cookies={props.cookies}
                  space={space}
                  transparent={transparentNav}
                />
              )}
              <BodyContainer {...props} />
            </div>
          </OakAppLayout>
        </HashRouter>
      </div>
    </ApolloProvider>
  );
};

export default withCookies(Content);
