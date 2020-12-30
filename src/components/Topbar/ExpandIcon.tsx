import React, { useEffect, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';

import { getProfile, setProfile } from '../../actions/ProfileActions';
import './ExpandIcon.scss';

const ExpandIcon = () => {
  const authorization = useSelector(state => state.authorization);

  const profile = useSelector(state => state.profile);

  const dispatch = useDispatch();

  const toggleSidebar = () => {
    dispatch(setProfile({ ...profile, sidebar: !profile.sidebar }));
  };

  return (
    <div className="expand-icon">
      {!profile.sidebar && (
        <i className="material-icons" onClick={toggleSidebar}>
          menu_open
        </i>
      )}
    </div>
  );
};

export default ExpandIcon;
