import React, { useEffect, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import { getProfile, setProfile } from '../../actions/ProfileActions';

import './NavElements.scss';
import NavGroup from './NavGroup';
import NavItem from './NavItem';

interface Props {
  space: string;
  closeAfterRouteChange?: boolean;
  //   history: any;
  //   cookies: any;
  //   location: any;
  //   match: any;
}

const NavElements = (props: Props) => {
  const authorization = useSelector(state => state.authorization);

  const profile = useSelector(state => state.profile);

  const dispatch = useDispatch();

  return (
    <div className="nav-elements">
      <NavItem
        to={`/${props.space}/home`}
        label="Home"
        closeAfterRouteChange={props.closeAfterRouteChange}
      />
      <NavItem
        to={`/${props.space}/project`}
        label="Projects"
        closeAfterRouteChange={props.closeAfterRouteChange}
      />
      <NavItem
        to={`/${props.space}/email-server`}
        label="Email Servers"
        closeAfterRouteChange={props.closeAfterRouteChange}
      />
      <NavItem
        to={`/${props.space}/template`}
        label="Templates"
        closeAfterRouteChange={props.closeAfterRouteChange}
      />
      <NavGroup
        space={props.space}
        closeAfterRouteChange={props.closeAfterRouteChange}
        label="group one"
        context="sidebar-group"
      >
        <NavItem to={`/${props.space}/project`} label="test label" />
      </NavGroup>
      <NavGroup
        space={props.space}
        closeAfterRouteChange={props.closeAfterRouteChange}
        label="group two"
        context="sidebar-group"
      >
        <NavItem to={`/${props.space}/project`} label="lorem ipsum" />
        <NavItem to={`/${props.space}/project`} label="dolor sit" />
        <NavItem to={`/${props.space}/project`} label="iwer dsfsdf" />
      </NavGroup>



      
      <NavGroup
        space={props.space}
        closeAfterRouteChange={props.closeAfterRouteChange}
        label="group two"
        context="sidebar-group"
      >
        <NavItem to={`/${props.space}/project`} label="lorem ipsum" />
        <NavItem to={`/${props.space}/project`} label="dolor sit" />
        <NavItem to={`/${props.space}/project`} label="iwer dsfsdf" />
      </NavGroup>
      <NavGroup
        space={props.space}
        closeAfterRouteChange={props.closeAfterRouteChange}
        label="group two"
        context="sidebar-group"
      >
        <NavItem to={`/${props.space}/project`} label="lorem ipsum" />
        <NavItem to={`/${props.space}/project`} label="dolor sit" />
        <NavItem to={`/${props.space}/project`} label="iwer dsfsdf" />
      </NavGroup>
      <NavGroup
        space={props.space}
        closeAfterRouteChange={props.closeAfterRouteChange}
        label="group two"
        context="sidebar-group"
      >
        <NavItem to={`/${props.space}/project`} label="lorem ipsum" />
        <NavItem to={`/${props.space}/project`} label="dolor sit" />
        <NavItem to={`/${props.space}/project`} label="iwer dsfsdf" />
      </NavGroup>
    </div>
  );
};

export default NavElements;
