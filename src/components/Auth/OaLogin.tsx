import React, { useEffect } from 'react';
import './Login.scss';

const queryString = require('query-string');

interface Props {
  cookies: any;
  history: any;
  location: any;
}

const OaLogin = (props: Props) => {
  useEffect(() => {
    if (props.location.search) {
      const query = queryString.parse(props.location.search);
      props.cookies.set(`expenso_${query.appspace}`, query.authKey);
      props.history.push(query.from ? query.from : '');
    }
  }, []);

  return <></>;
};

export default OaLogin;
