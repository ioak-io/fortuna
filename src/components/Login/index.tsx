import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './style.scss';
import LoginMethod from './LoginMethod';
import OakSection from '../../oakui/wc/OakSection';
import { useSearchParams } from 'react-router-dom';

interface Props {
  history: any;
  match: any;
  params: string;
  asset: string;
  location: any;
}

const Login = (props: Props) => {
  const [searchParams] = useSearchParams();
  const authorization = useSelector((state: any) => state.authorization);
  const profile = useSelector((state: any) => state.profile);
  const [from, setFrom] = useState<string | undefined>();
  const oaLogin = () => {
    props.navigate(
      `/${props.asset}/login/oa${from ? `?from=${from}` : ''}`
    );
  };
  const emailLogin = () => {
    props.navigate(
      `/${props.asset}/login/email${from ? `?from=${from}` : ''}`
    );
  };

  const fortunaLogin = () => {
    console.log('not yet implemented');
  };

  useEffect(() => {
    if (authorization.isAuth) {
      props.navigate(`/${props.asset}/article`);
    }
  }, [authorization]);

  useEffect(() => {
    setFrom(searchParams.get("from") || undefined);
  }, [searchParams]);

  return (
    <OakSection>
      Sign in
      <br />
      Choose the preferred authentication method to continue
      <div className="view-asset-item">
        <div className="space-top-3 fortuna-signin">
          <div className="login-home">
            <LoginMethod
              action={oaLogin}
              icon="corporate_fare"
              label="Enterprise Login"
            />
            <LoginMethod
              action={fortunaLogin}
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
    </OakSection>
  );
};

export default Login;
