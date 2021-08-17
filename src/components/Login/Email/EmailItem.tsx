import React, { useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { isEmptyOrSpaces, isEmptyAttributes } from '../../Utils';
import { NEW_EMAIL_SESSION } from '../../Types/schema';
import './style.scss';
import OakButton from '../../../oakui/wc/OakButton';
import OakInput from '../../../oakui/wc/OakInput';

interface Props {
  history: any;
  tokenLogin: Function;
  newAccount: Function;
}

const EmailItem = (props: Props) => {
  const gqlClient = useApolloClient();
  const [state, setState] = useState({ email: '' });
  const [formErrors, setFormErrors] = useState<any>({
    email: '',
  });

  const [isTokenSent, setIsTokenSent] = useState(false);

  // Temporary until email functionality is implemented
  const [token, setToken] = useState('');

  const handleChange = (detail: any) => {
    setState({
      ...state,
      [detail.name]: detail.value,
    });
  };

  const login = async (event: any) => {
    event.preventDefault();
    const errorFields: any = { email: '' };

    if (isEmptyOrSpaces(state.email)) {
      errorFields.email = 'Email cannot be empty';
    }
    if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        state.email.trim().toLowerCase()
      )
    ) {
      errorFields.email = 'Invalid email';
    }
    setFormErrors(errorFields);
    if (isEmptyAttributes(errorFields)) {
      const { data } = await gqlClient.query({
        query: NEW_EMAIL_SESSION,
        variables: { email: state.email },
      });
      if (data?.newEmailSession) {
        setToken(data?.newEmailSession.sessionId);
        setIsTokenSent(true);
      } else {
        props.newAccount();
      }
    }
  };

  const cancelLogin = () => {
    props.history.goBack();
  };

  return (
    <>
      {isTokenSent && (
        <>
          <div className="page-header">
            Email authentication
            <br />
            You will receive an authentication token to your email
          </div>
          <div className="typhography-4 hyperlink-inline">
            Authentication token is generated and sent to your email. You can
            click on the login link from your email instruction or copy paste{' '}
            {token} the token id&nbsp;
            <div className="hyperlink" onClick={() => props.tokenLogin()}>
              here
            </div>
          </div>
        </>
      )}
      {!isTokenSent && (
        <>
          <div className="page-header">
            Email authentication
            <br />
            You will receive an authentication token to your email
            <div className="action-header position-right">
              <OakButton handleClick={login} theme="primary" variant="appear">
                <i className="material-icons">double_arrow</i>Submit
              </OakButton>
              {props.history.length > 2 && (
                <OakButton
                  handleClick={() => cancelLogin()}
                  theme="default"
                  variant="appear"
                >
                  <i className="material-icons">close</i>Cancel
                </OakButton>
              )}
            </div>
          </div>
          <form method="GET" onSubmit={login} noValidate>
            <OakInput
              label="Email"
              value={state.email}
              name="email"
              handleChange={handleChange}
            />
          </form>
          <div className="email-login-footer">
            <div>or</div>
            <div className="hyperlink" onClick={() => props.tokenLogin()}>
              Enter authentication token, if you already have one
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EmailItem;
