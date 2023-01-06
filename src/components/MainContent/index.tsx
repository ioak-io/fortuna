import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './style.scss';

import Notification from '../Notification';
import NavigationContainer from '../App/NavigationContainer';
import BodyContainer from '../App/BodyContainer';
import SideContent from './SideContent';

interface Props {
  cookies: any;
  space: string;
}

const MainContent = (props: Props) => {
  const profile = useSelector((state: any) => state.profile);
  const authorization = useSelector((state: any) => state.authorization);
  const dispatch = useDispatch();

  return (
    <>
      <SideContent cookies={props.cookies} space={props.space} />
      {/* <NavigationContainer
        cookies={props.cookies}
        space={props.space}
        transparent={false}
      /> */}
      <div
        className={`main-content ${
          profile.sidebar
            ? 'main-content__sidebar-active'
            : 'main-content__sidebar-inactive'
        }`}
      >
        <BodyContainer {...props} />
      </div>
    </>
  );
};

export default MainContent;
