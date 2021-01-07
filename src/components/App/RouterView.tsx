import React from 'react';

import { Route } from 'react-router-dom';
import './RouterView.scss';
import Home from '../Home';
import OaLogin from '../Auth/OaLogin';
import Landing from '../Landing';
import Tenant from '../Tenant';
import OakRoute from '../Auth/OakRoute';
import Unauthorized from '../Auth/Unauthorized';
import OneAuth from '../Login/OneAuth/index';
import Login from '../Login/index';
import PlaySpinner from '../PlaySpinner';
import PlayButton from '../PlayButton';
import PlayModal from '../PlayModal';
import PlayChart from '../PlayChart';
import PlayTable from '../PlayTable';

interface Props {
  cookies: any;
}

const RouterView = (props: Props) => {
  return (
    <div className="router-view">
      <Route
        path="/login"
        render={propsLocal => (
          <OakRoute {...propsLocal} {...props} component={OaLogin} />
        )}
      />
      <Route
        path="/:space/unauthorized"
        render={propsLocal => (
          <OakRoute
            {...propsLocal}
            {...props}
            component={Unauthorized}
            middleware={['isAuthenticated']}
          />
        )}
      />
      <Route
        path="/"
        exact
        render={propsLocal => (
          <OakRoute
            {...propsLocal}
            {...props}
            component={Landing}
            middleware={['readAuthentication']}
          />
        )}
      />
      <Route
        path="/home"
        exact
        render={propsLocal => (
          <OakRoute {...propsLocal} {...props} component={Landing} />
        )}
      />
      <Route
        path="/tenant"
        exact
        render={propsLocal => (
          <OakRoute {...propsLocal} {...props} component={Tenant} />
        )}
      />
      <Route
        path="/:space/home"
        render={propsLocal => (
          <OakRoute
            {...propsLocal}
            {...props}
            component={Home}
            middleware={['readAuthentication']}
          />
        )}
      />
      <Route
        path="/:space/play-spinner"
        render={propsLocal => (
          <OakRoute
            {...propsLocal}
            {...props}
            component={PlaySpinner}
            middleware={['readAuthentication']}
          />
        )}
      />
      <Route
        path="/:space/play-button"
        render={propsLocal => (
          <OakRoute
            {...propsLocal}
            {...props}
            component={PlayButton}
            middleware={['readAuthentication']}
          />
        )}
      />
      <Route
        path="/:space/play-modal"
        render={propsLocal => (
          <OakRoute
            {...propsLocal}
            {...props}
            component={PlayModal}
            middleware={['readAuthentication']}
          />
        )}
      />
      <Route
        path="/:space/play-chart"
        render={propsLocal => (
          <OakRoute
            {...propsLocal}
            {...props}
            component={PlayChart}
            middleware={['readAuthentication']}
          />
        )}
      />
      <Route
        path="/:space/play-table"
        render={propsLocal => (
          <OakRoute
            {...propsLocal}
            {...props}
            component={PlayTable}
            middleware={['readAuthentication']}
          />
        )}
      />
      <Route
        path="/:space/login/home"
        render={propsLocal => (
          <OakRoute
            {...propsLocal}
            {...props}
            component={Login}
            middleware={['readAuthentication']}
          />
        )}
      />
      <Route
        path="/:space/login/oa"
        render={propsLocal => (
          <OakRoute
            {...propsLocal}
            {...props}
            component={OneAuth}
            middleware={['readAuthentication']}
          />
        )}
      />
    </div>
  );
};

export default RouterView;
