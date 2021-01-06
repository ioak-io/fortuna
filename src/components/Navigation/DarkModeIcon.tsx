import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './DarkModeIcon.scss';
import { setProfile } from '../../actions/ProfileActions';
import { NightsStay, WbSunny } from '@material-ui/icons';

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
    <div className={`dark-mode-icon ${profile.theme}`} onClick={toggleMode}>
      {profile.theme === 'theme_dark' && (
        <WbSunny className="cursor-pointer" />
      )}
      {profile.theme !== 'theme_dark' && (
        <NightsStay className="cursor-pointer" />
      )}
    </div>
  );
};

export default DarkModeIcon;
