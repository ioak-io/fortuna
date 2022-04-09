import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { addDays, format } from 'date-fns';
import {
  faBuilding,
  faCheck,
  faCog,
  faDatabase,
  faPlus,
  faShieldAlt,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.scss';
import BillModel from '../../../model/BillModel';
import ExpenseModel from '../../../model/ExpenseModel';
import Topbar from '../../../components/Topbar';
import SideNavLink from '../../../components/SideNavLink';
import EditCompany from './EditCompany';
import Permissions from './Permissions';
import BackupAndRestore from './BackupAndRestore';

const queryString = require('query-string');

interface Props {
  space: string;
  location: any;
}

const SettingsPage = (props: Props) => {
  const history = useHistory();
  const authorization = useSelector((state: any) => state.authorization);
  const [queryParam, setQueryParam] = useState<any>({});

  useEffect(() => {
    const query = queryString.parse(props.location.search);
    setQueryParam({ ...query });
  }, [props.location.search]);

  return (
    <div className="settings-page">
      <Topbar title="Settings" />
      <div className="settings-page-container main-section page-width">
        <div className="settings-page__left">
          <SideNavLink
            link={`#/${props.space}/settings?link=general`}
            active={queryParam.link === 'general'}
          >
            <FontAwesomeIcon icon={faCog} />
            General
          </SideNavLink>
          <SideNavLink
            link={`/#/${props.space}/settings?link=permissions`}
            active={queryParam.link === 'permissions'}
          >
            <FontAwesomeIcon icon={faShieldAlt} />
            Permissions
          </SideNavLink>
          <SideNavLink
            link={`/#/${props.space}/settings?link=backup`}
            active={queryParam.link === 'backup'}
          >
            <FontAwesomeIcon icon={faDatabase} />
            Backup and Restore
          </SideNavLink>
        </div>
        <div className="settings-page__main">
          {queryParam.link === 'general' && (
            <EditCompany space={props.space} location={props.location} />
          )}
          {queryParam.link === 'permissions' && (
            <Permissions space={props.space} location={props.location} />
          )}
          {queryParam.link === 'backup' && (
            <BackupAndRestore space={props.space} location={props.location} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
