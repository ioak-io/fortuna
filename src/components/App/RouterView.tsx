import React from 'react';

import { Route } from 'react-router-dom';
import './RouterView.scss';
import OaLogin from '../Auth/OaLogin';
import OakRouteApp from '../Auth/OakRouteApp';
import Unauthorized from '../Auth/Unauthorized';
import OakRouteGraph from '../Auth/OakRouteGraph';
import Login from '../Login';
import ExternLogin from '../Auth/ExternLogin';
import OneAuth from '../Login/OneAuth';
import Email from '../Login/Email';
import Home from '../Home';
import Landing from '../Landing';
import ExpensePage from '../Page/ExpensePage';
import CategoryPage from '../Page/CategoryPage';

interface Props {
  cookies: any;
}

const RouterView = (props: Props) => {
  return (
    <div className="router-view">
      <Route
        path="/login"
        render={(propsLocal) => (
          <OakRouteApp {...propsLocal} {...props} component={OaLogin} />
        )}
      />
      <Route
        path="/:space/unauthorized"
        render={(propsLocal) => (
          <OakRouteApp
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
        render={(propsLocal) => (
          <OakRouteApp {...propsLocal} {...props} component={Home} />
        )}
      />
      <Route
        path="/:space/login/email"
        render={(propsLocal) => (
          <OakRouteApp
            {...propsLocal}
            {...props}
            component={Email}
            middleware={['readAuthentication']}
          />
        )}
      />

      <Route
        path="/:space/home"
        exact
        render={(propsLocal) => (
          <OakRouteApp
            {...propsLocal}
            {...props}
            component={Home}
            middleware={['readAuthentication']}
          />
        )}
      />

      <Route
        path="/:space/category"
        exact
        render={(propsLocal) => (
          <OakRouteApp
            {...propsLocal}
            {...props}
            component={CategoryPage}
            middleware={['authenticate']}
          />
        )}
      />
      <Route
        path="/:space/expense"
        exact
        render={(propsLocal) => (
          <OakRouteApp
            {...propsLocal}
            {...props}
            component={ExpensePage}
            middleware={['authenticate']}
          />
        )}
      />
    </div>
  );
};

export default RouterView;
