import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import EmailItem from './EmailItem';
import AccountItem from './AccountItem';
import TokenItem from './TokenItem';
import OakSection from '../../../oakui/wc/OakSection';
import { useSearchParams } from 'react-router-dom';

interface Props {
  history: any;
  location: any;
  asset: string;
  cookies: any;
}

const Email = (props: Props) => {
  const [searchParams] = useSearchParams();
  const authorization = useSelector((state: any) => state.authorization);
  const [state, setState] = useState({ type: 'email' });

  useEffect(() => {
    setState({ type: searchParams.get("type") || "email" })
  }, [props.location.search]);

  const emailLogin = () => {
    props.navigate(
      `/${props.asset}/login/email?type=email&from=${searchParams.get("from")}`
    );
  };

  const tokenLogin = () => {
    props.navigate(
      `/${props.asset}/login/email?type=token&from=${searchParams.get("from")}`
    );
  };

  const newAccount = () => {
    props.navigate(
      `/${props.asset}/login/email?type=new&from=${searchParams.get("from")}`
    );
  };

  useEffect(() => {
    if (authorization.isAuth) {
      props.navigate(searchParams.get("from") || `/${props.asset}/article`);
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
