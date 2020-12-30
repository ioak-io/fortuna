import React, { useEffect, useState } from 'react';
import './style.scss';
import OakText from '../../oakui/OakText';
import { sendMessage } from '../../events/MessageService';
import { sentTenantUrl } from './TenantService';
import { preSignup, createTenant } from '../Auth/AuthService';
import { Profile } from '../Types/GeneralTypes';
import { isEmptyOrSpaces } from '../Utils';
import OakButton from '../../oakui/OakButton';

interface Props {
  getProfile: Function;
  profile: Profile;
  history: any;
}
interface State {
  name: string;
  email: string;
  pageNo: number;
  password: string;
  repeatPassword: string;
  jwtPassword: string;
  banner: any;
  created: boolean;
  errorFields: {
    name: boolean;
    email: boolean;
    password: boolean;
    repeatPassword: boolean;
    jwtPassword: boolean;
  };
}

const Tenant = (props: Props) => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    repeatPassword: '',
    jwtPassword: '',
    pageNo: 1,
    created: false,
  });

  const [banner, setBanner] = useState<null | { name: any }>(null);

  const [errorFields, setErrorFields] = useState({
    name: false,
    email: false,
    password: false,
    repeatPassword: false,
    jwtPassword: false,
  });

  useEffect(() => {
    props.getProfile();
  }, []);

  const handleChange = event => {
    setData({ ...data, [event.currentTarget.name]: event.currentTarget.value });
  };

  const sentTenantUrlAction = () => {
    sentTenantUrl({
      name: data.name,
    })
      .then((response: any) => {
        if (response === 200) {
          sendMessage('notification', true, {
            message: 'Password sent successfully',
            type: 'success',
            duration: 3000,
          });
        } else {
          sendMessage('notification', true, {
            type: 'failure',
            message: 'Invalid Email error',
            duration: 3000,
          });
        }
      })
      .catch(error => {
        sendMessage('notification', true, {
          type: 'failure',
          message: 'Bad request',
          duration: 3000,
        });
      });
  };

  const clearError = () => {
    setErrorFields({
      name: false,
      email: false,
      password: false,
      repeatPassword: false,
      jwtPassword: false,
    });
  };

  const setError = fieldName => {
    setErrorFields({ ...errorFields, [fieldName]: true });
  };

  const validate = () => {
    if (isEmptyOrSpaces(data.name)) {
      setError('name');
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Tenant name cannot be empty',
        duration: 3000,
      });
      return false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
      setError('email');
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Email ID is invalid',
        duration: 3000,
      });
      return false;
    }

    if (isEmptyOrSpaces(data.password)) {
      setError('password');
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Password cannot be empty',
        duration: 3000,
      });
      return false;
    }

    if (data.password !== data.repeatPassword) {
      setError('repeatPassword');
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Password and repeat password should be same',
        duration: 3000,
      });
      return false;
    }

    return true;
  };

  const submit = event => {
    event.preventDefault();
    sendMessage('spinner');
    clearError();

    if (!validate()) {
      return;
    }

    preSignup({ name: data.name }).then(response => {
      if (response.status === 200) {
        createTenantAction(response.data);
      }
    });
  };

  const handleImageChange = e => {
    setBanner(e.target.files[0]);
  };

  const createTenantAction = preSignupData => {
    createTenant({
      tenantName: data.name,
      email: data.email,
      password: data.password,
      jwtPassword: data.jwtPassword,
      solution: preSignupData.solution,
      salt: preSignupData.salt,
      banner,
    })
      .then(response => {
        if (response.status === 200) {
          sendMessage('notification', true, {
            type: 'success',
            message: 'Tenant has been created. You can proceed now',
            duration: 3000,
          });
          setData({ ...data, pageNo: data.pageNo + 1, created: true });
        } else {
          sendMessage('notification', true, {
            message: 'We are facing some problem, please try after sometime',
            duration: 3000,
          });
        }
      })
      .catch(error => {
        sendMessage('notification', true, {
          type: 'failure',
          message: 'Unknown error. Please try again or at a later time',
          duration: 3000,
        });
      });
  };

  const gotoTenantPage = () => {
    props.history.push(`/${data.name}/home`);
  };

  return (
    <div className="tenant boxed">
      {!data.created && (
        <div className="typography-3 space-bottom-4">Tenant creation</div>
      )}
      {data.created && (
        <div className="typography-3 space-bottom-4">
          Tenant [{data.name}] available now
        </div>
      )}
      {data.pageNo === 1 && (
        <div className="form">
          <OakText
            id="name"
            data={data}
            label="Tenant Name"
            handleChange={e => handleChange(e)}
            errorFields={errorFields}
          />
          <OakText
            id="email"
            data={data}
            label="Administrator Email"
            handleChange={e => handleChange(e)}
            errorFields={errorFields}
          />
          <OakText
            id="password"
            type="password"
            data={data}
            label="Administrator Password"
            handleChange={e => handleChange(e)}
            errorFields={errorFields}
          />
          <OakText
            id="repeatPassword"
            type="password"
            data={data}
            label="Repeat Password"
            handleChange={e => handleChange(e)}
            errorFields={errorFields}
          />
          <OakText
            id="jwtPassword"
            type="password"
            data={data}
            label="JWT Password"
            handleChange={e => handleChange(e)}
            errorFields={errorFields}
          />
          <label className="file-upload space-top-1 space-bottom-4">
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              required
            />
            <i className="material-icons">add_photo_alternate</i>
            {!banner && 'Choose Banner/Cover Image'}
            {banner && banner.name}
          </label>
          <div className="action">
            <OakButton theme="primary" variant="appear" action={submit}>
              Create Tenant
            </OakButton>
          </div>
        </div>
      )}
      {data.created && (
        <OakButton theme="primary" variant="disappear" action={gotoTenantPage}>
          Take me to my tenant
        </OakButton>
      )}
    </div>
  );
};

export default Tenant;
