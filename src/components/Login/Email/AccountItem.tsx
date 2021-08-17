import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { isEmptyOrSpaces, isEmptyAttributes } from '../../Utils';

import { CREATE_EMAIL_ACCOUNT } from '../../Types/schema';
import { UserPayload } from '../../../types/graphql';
import OakInput from '../../../oakui/wc/OakInput';
import OakButton from '../../../oakui/wc/OakButton';

interface Props {
  history: any;
  emailLogin: Function;
}
const AccountItem = (props: Props) => {
  const [createEmailAccount] = useMutation(CREATE_EMAIL_ACCOUNT);
  const [state, setState] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });
  const [formErrors, setFormErrors] = useState<any>({
    email: '',
    firstName: '',
    lastName: '',
  });

  const [message, setMessage] = useState(false);

  const handleChange = (detail: any) => {
    setState({
      ...state,
      [detail.name]: detail.value,
    });
  };

  const cancelLogin = () => {
    props.history.goBack();
  };

  const submit = (event: any) => {
    console.log('*********');
    event.preventDefault();
    const errorFields: any = { email: '', firstName: '', lastName: '' };

    if (isEmptyOrSpaces(state.firstName)) {
      errorFields.firstName = 'First name cannot be empty';
    }
    if (isEmptyOrSpaces(state.lastName)) {
      errorFields.lastName = 'Last name cannot be empty';
    }
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
      const payload: UserPayload = {
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
      };
      createEmailAccount({
        variables: {
          payload,
        },
      }).then(() => {
        setMessage(!message);
      });
    }
  };

  return (
    <>
      {message && (
        <div className="typhography-4">
          Thank you for creating account. You are ready to go! follow the
          instruction provided in the email or click on
          <div className="hyperlink" onClick={() => props.emailLogin()}>
            Login with email
          </div>
        </div>
      )}
      {!message && (
        <form method="GET" onSubmit={submit} noValidate>
          <div className="page-header">
            Email authentication
            <br />
            You dont have an user account yet. Signup now
            <div className="action-header position-right">
              <OakButton handleClick={submit} theme="primary" variant="appear">
                <i className="material-icons">double_arrow</i>Save
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
          <div className="user-form">
            <OakInput
              label="First Name"
              value={state.firstName}
              name="firstName"
              handleChange={handleChange}
            />
            <OakInput
              label="Last name"
              value={state.lastName}
              name="lastName"
              handleChange={handleChange}
            />
            <OakInput
              label="Email"
              value={state.email}
              name="email"
              handleChange={handleChange}
            />
          </div>
        </form>
      )}
    </>
  );
};

export default AccountItem;
