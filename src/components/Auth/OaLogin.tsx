import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { httpGet, httpPost } from '../Lib/RestTemplate';
import './Login.scss';

interface Props {
  cookies: any;
  history: any;
  location: any;
}

const appRealm = process.env.REACT_APP_ONEAUTH_APPSPACE_ID || '';

const OaLogin = (props: Props) => {
  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (props.location.search) {
      httpGet('/user/token/local', {
        headers: {
          Authorization: searchParams.get("access_token"),
        },
      })
        .then((response) => {
          if (response.status === 200) {
            console.log('**', response.data.token);
            props.cookies.set(`fortuna-access_token`, response.data.token);
            props.cookies.set(`fortuna-refresh_token`, searchParams.get("refresh_token"));
            props.history.push(searchParams.get("from") || '/home');
          }
          return Promise.resolve({});
        })
        .catch((error) => {
          return Promise.resolve({});
        });
    }
  }, []);

  return <></>;
};

export default OaLogin;
