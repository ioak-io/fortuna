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
        to={`/${props.space}/play-button`}
        label="Button"
        closeAfterRouteChange={props.closeAfterRouteChange}
      />
      <NavItem
        to={`/${props.space}/play-spinner`}
        label="Spinner"
        closeAfterRouteChange={props.closeAfterRouteChange}
      />
      <NavGroup
        space={props.space}
        closeAfterRouteChange={props.closeAfterRouteChange}
        label="UI Elements"
        context="sidebar-group"
      >
      <NavItem to={`/${props.space}/play-button`} label="Button" />
        <NavItem to={`/${props.space}/play-table`} label="Table" />
        <NavItem to={`/${props.space}/play-chart`} label="Chart" />
        <NavItem to={`/${props.space}/play-spinner`} label="Spinner" />
        <NavItem to={`/${props.space}/play-modal`} label="Modal" />
      </NavGroup>
    </div>
  );
};

export default NavElements;
