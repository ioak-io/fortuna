import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
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
import Topbar from '../../../components/Topbar';

interface Props {
  space: string;
  location: any;
}

const Permissions = (props: Props) => {
  const navigate = useNavigate();
  const authorization = useSelector((state: any) => state.authorization);
  const users = useSelector((state: any) => state.user.items);
  const [userInviteList, setUserInviteList] = useState<any[]>([]);
  const [userMap, setUserMap] = useState<any>({});
  const [formId, setFormId] = useState(newId());
  const [state, setState] = useState({ email: '' });

  useEffect(() => {
    const _userMap: any = {};
    users.forEach((item: any) => {
      _userMap[item._id] = item;
    });
    setUserMap(_userMap);
  }, [users]);

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
        getUserInvite(props.space, authorization).then((response: any) => {
          setUserInviteList([...response]);
        });
      });
    }
  };

  const deleteUser = (userId: string) => {
    console.log('delete user', userId);
  };

  return (
    <div>
      <Topbar title="User administration" />
      <div className="main-section">
        <div className="permissions page-width content-section">
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
                {userInviteList.map((user: any) => (
                  <tr key={user._id}>
                    <td>{userMap[user.userId]?.given_name}</td>
                    <td>{userMap[user.userId]?.family_name}</td>
                    <td>{user.email}</td>
                    <td>{user.accepted ? 'Active' : 'Invited'}</td>
                    <td className="action-column">
                      <button
                        className="permissions__list__button button"
                        onClick={() => deleteUser(user._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permissions;
