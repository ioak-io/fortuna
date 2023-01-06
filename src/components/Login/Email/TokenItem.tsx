import React, { useState, useEffect } from 'react';
import OakButton from '../../../oakui/wc/OakButton';
import OakInput from '../../../oakui/wc/OakInput';
import { isEmptyOrSpaces, isEmptyAttributes } from '../../Utils';

interface Props {
  history: any;
  emailLogin: Function;
  asset: string;
  queryParam: any;
  cookies: any;
}
const TokenItem = (props: Props) => {
  const [state, setState] = useState({ token: '' });
  const [formErrors, setFormErrors] = useState<any>({
    token: '',
  });

  useEffect(() => {
    if (props.queryParam.auth_token) {
      console.log(props.queryParam.auth_token);

      setSessionValue(
        `fortuna_${props.asset}`,
        `email ${props.queryParam.auth_token}`
      );
      props.navigate(`/${props.asset}/article`);
    }
  }, [props.queryParam]);

  const handleChange = (detail: any) => {
    setState({
      ...state,
      [detail.name]: detail.value,
    });
  };

  const login = (event: any) => {
    event.preventDefault();
    const errorFields: any = { token: '' };

    if (isEmptyOrSpaces(state.token)) {
      errorFields.token = 'Token cannot be empty';
    }
    setFormErrors(errorFields);
    if (isEmptyAttributes(errorFields)) {
      props.navigate(
        `/${props.asset}/login/email?type=token&auth_token=${state.token}`
      );
    }
  };

  const cancelLogin = () => {
    props.history.goBack();
  };

  return (
    <>
      <div className="page-header">
        Email authentication
        <br />
        You would have received an authentication token in your email
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
          label="Token"
          value={state.token}
          name="token"
          handleInput={handleChange}
        />
      </form>
      <div className="email-login-footer">
        <div>or</div>
        <div className="hyperlink" onClick={() => props.emailLogin()}>
          Get a token to your email, if you did not receive one
        </div>
      </div>
    </>
  );
};

export default TokenItem;
