import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './style.scss';
import LoginMethod from './LoginMethod';
import OakHeading from '../../oakui/OakHeading';
import OakPage from '../../oakui/OakPage';
import OakCard from '../../oakui/OakCard';
import oaBlack from '../../images/oneauth_black_small.svg';
import oaWhite from '../../images/oneauth_white_small.svg';

interface Props {
  history: any;
  match: any;
  params: string;
  space: string;
  location: any;
}

const queryString = require('query-string');

const Login = (props: Props) => {
  const authorization = useSelector(state => state.authorization);
  const profile = useSelector(state => state.profile);
  const [from, setFrom] = useState<string | undefined>();
  const oaLogin = () => {
    props.history.push(
      `/${props.space}/login/oa${from ? `?from=${from}` : ''}`
    );
  };
  const emailLogin = () => {
    props.history.push(
      `/${props.space}/login/email${from ? `?from=${from}` : ''}`
    );
  };

  const emailflowLogin = () => {
    console.log('not yet implemented');
  };

  useEffect(() => {
    if (authorization.isAuth) {
      props.history.push(`/${props.space}/home`);
    }
  }, [authorization]);

  useEffect(() => {
    const query = queryString.parse(props.location.search);
    query.from ? setFrom(query.from) : setFrom(undefined);
  }, [props.location.search]);

  return (
    <OakPage>
      <OakCard>
        <OakHeading
          title="Sign in"
          subtitle="Choose the preferred authentication method to continue"
        />
        <div className="view-asset-item">
          <div className="space-top-3 infinite-reserve-signin">
            <div className="login-home">
              <LoginMethod
                action={oaLogin}
                icon="corporate_fare"
                label="Enterprise Login"
              />
              <LoginMethod
                action={emailflowLogin}
                icon="people"
                label="Individual Login"
              />
              <LoginMethod
                action={emailLogin}
                icon="email"
                label="OTP via Email"
              />
            </div>
          </div>
        </div>
      </OakCard>
    </OakPage>
  );
};

export default Login;
