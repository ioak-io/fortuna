import React, { useState, useEffect } from 'react';
import './Login.scss';
import { useApolloClient } from '@apollo/client';

import { NEW_EXTERN_SESSION } from '../Types/schema';
import OakSection from '../../oakui/wc/OakSection';

const queryString = require('query-string');

interface Props {
  cookies: any;
  history: any;
  location: any;
  asset: string;
}

const ExternLogin = (props: Props) => {
  const gqlClient = useApolloClient();
  const [isInvalidToken, setIsInvalidToken] = useState(false);
  useEffect(() => {
    if (props.location.search) {
      const query = queryString.parse(props.location.search);
      createSession(query.token);
    }
  }, []);

  const createSession = async (token: string) => {
    const { data } = await gqlClient.query({
      query: NEW_EXTERN_SESSION,
      variables: { token, asset: props.asset },
    });
    if (data?.newExternSession?.sessionId) {
      props.cookies.set(
        `fortuna_${props.asset}`,
        `extern ${data?.newExternSession?.sessionId}`
      );
      props.history.push(`/${props.asset}/article`);
    } else {
      setIsInvalidToken(true);
    }
  };

  return (
    <>
      {isInvalidToken && (
        <OakSection>
          <div className="extern-login">Invalid token</div>
        </OakSection>
      )}
    </>
  );
};

export default ExternLogin;
