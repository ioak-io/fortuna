import React, { useEffect, useState } from 'react';

import { Route, Routes } from 'react-router-dom';
import './RouterView.scss';
import Home from '../Home';
import { loginPageSubject } from '../../events/LoginPageEvent';
import ProtectedRoute from '../ProtectedRoute';
import LandingPage from '../Page/LandingPage';
import OaLogin from '../Auth/OaLogin';

interface Props {
}

const RouterView = (props: Props) => {
  const [loginPage, setLoginPage] = useState(true);

  useEffect(() => {
    loginPageSubject.subscribe((message) => {
      setLoginPage(message.state);
    });
  }, []);

  return (
    <div
      className={`router-view ${loginPage ? 'login-page' : 'not-login-page'}`}
    >
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute
              middleware={['readAuthenticationOa']}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute
              middleware={['authenticate']} component={LandingPage} />
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute
              middleware={['readAuthenticationOa']} component={OaLogin} />}
        />
      </Routes>
    </div>
  );
};

export default RouterView;
