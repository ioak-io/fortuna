import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { compose } from '@oakui/core-stage/style-composer/OakTableComposer';

import './Permissions.scss';
import { newId } from '../../../events/MessageService';
import CompanyModel from '../../../model/CompanyModel';
import OakInput from '../../../oakui/wc/OakInput';
import OakForm from '../../../oakui/wc/OakForm';
import { saveCompany } from '../EditCompanyPage/service';
import OakButton from '../../../oakui/wc/OakButton';
import { getUserInvite, sendUserInvite } from './service';

const queryString = require('query-string');

interface Props {
  space: string;
  location: any;
}

const Permissions = (props: Props) => {
  const history = useHistory();
  const authorization = useSelector((state: any) => state.authorization);
  const users = useSelector((state: any) => state.user.items);
  const [userInviteList, setUserInviteList] = useState<any[]>([]);
  const [queryParam, setQueryParam] = useState<any>({});
  const [formId, setFormId] = useState(newId());
  const [state, setState] = useState({ email: '' });

  useEffect(() => {
    if (authorization.isAuth) {
      getUserInvite(props.space, authorization).then((response: any) => {
        setUserInviteList([...response]);
      });
    }
  }, [authorization]);

  const handleChange = (detail: any) => {
    setState({ ...state, [detail.name]: detail.value });
  };

  const addUser = (event: any) => {
    if (event.isValid) {
      sendUserInvite(props.space, state, authorization).then(() => {
        console.log('user invite sent');
      });
    }
  };

  const deleteUser = (userId: string) => {
    console.log('delete user', userId);
  };

  return (
    <div className="permissions content-section">
      <OakForm formGroupName={formId} handleSubmit={addUser}>
        <div className="permissions__form">
          <OakInput
            name="email"
            value={state.email}
            formGroupName={formId}
            handleInput={handleChange}
            size="small"
            color="container"
            regexp={/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/}
            placeholder="Invite an user by e-mail"
            autofocus
            required
          />
          <OakButton formGroupName={formId} type="submit">
            Invite user
          </OakButton>
        </div>
      </OakForm>
      <div className="permissions__list">
        <table
          className={compose({
            color: 'surface',
            dense: true,
          })}
        >
          <thead>
            <tr>
              <th>First name</th>
              <th>Last name</th>
              <th>Email</th>
              <th>Status</th>
              <th className="action-column"> </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user._id}>
                <td>{user.given_name}</td>
                <td>{user.family_name}</td>
                <td>{user.email}</td>
                <td>Active</td>
                <td className="action-column">
                  <OakButton
                    handleClick={() => deleteUser(user._id)}
                    size="xsmall"
                    theme="danger"
                    variant="block"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </OakButton>
                </td>
              </tr>
            ))}
            {userInviteList.map((user: any) => (
              <tr key={user._id}>
                <td>-</td>
                <td>-</td>
                <td>{user.email}</td>
                <td>Invited</td>
                <td className="action-column">
                  <OakButton
                    handleClick={() => deleteUser(user._id)}
                    size="xsmall"
                    theme="danger"
                    variant="block"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </OakButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Permissions;
