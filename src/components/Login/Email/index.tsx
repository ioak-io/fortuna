import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import EmailItem from './EmailItem';
import AccountItem from './AccountItem';
import TokenItem from './TokenItem';
import OakSection from '../../../oakui/wc/OakSection';

interface Props {
  history: any;
  location: any;
  asset: string;
  cookies: any;
}

const queryString = require('query-string');

const Email = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);
  const [state, setState] = useState({ type: 'email' });
  const [queryParam, setQueryParam] = useState<any>({});

  useEffect(() => {
    const query = queryString.parse(props.location.search);
    query.type ? setState({ type: query.type }) : setState({ type: 'email' });
    setQueryParam(query);
  }, [props.location.search]);

  const emailLogin = () => {
    props.history.push(
      `/${props.asset}/login/email?type=email&from=${queryParam.from}`
    );
  };

  const tokenLogin = () => {
    props.history.push(
      `/${props.asset}/login/email?type=token&from=${queryParam.from}`
    );
  };

  const newAccount = () => {
    props.history.push(
      `/${props.asset}/login/email?type=new&from=${queryParam.from}`
    );
  };

  useEffect(() => {
    if (authorization.isAuth) {
      props.history.push(queryParam.from || `/${props.asset}/article`);
    }
  }, [authorization]);

  return (
    <OakSection>
      <div className="view-asset-item">
        {state.type === 'new' && (
          <AccountItem history={props.history} emailLogin={emailLogin} />
        )}
      </div>
    </OakSection>
  );
};

export default Email;
