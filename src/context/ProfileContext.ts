import React from 'react';
import { string } from 'prop-types';

// this is the equivalent to the createStore method of Redux
// https://redux.js.org/api/createstore

const ProfileContext = React.createContext({});

export default ProfileContext;

// export const ThemeContext = React.createContext(["light", () => {}]);
