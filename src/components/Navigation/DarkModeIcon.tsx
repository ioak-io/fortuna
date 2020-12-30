import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './style.scss';
import { setProfile } from '../../actions/ProfileActions';

const DarkModeIcon = () => {
  const profile = useSelector(state => state.profile);
  const dispatch = useDispatch();
  const toggleMode = () => {
    dispatch(
      setProfile({
        theme: profile.theme === 'theme_dark' ? 'theme_light' : 'theme_dark',
      })
    );
  };
  return (
    <div className="dark-mode-icon" onClick={toggleMode}>
      {profile.theme === 'theme_dark' && (
        <i className="material-icons">wb_sunny</i>
      )}
      {profile.theme !== 'theme_dark' && (
        <i className="material-icons">nights_stay</i>
      )}
    </div>
  );
};

export default DarkModeIcon;
