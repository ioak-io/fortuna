import {
  faBalanceScaleRight,
  faCalendarAlt,
  faChartArea,
  faChartBar,
  faCog,
  faCogs,
  faDatabase,
  faFileExport,
  faFileImport,
  faFingerprint,
  faHome,
  faMoneyBillWave,
  faMoneyBillWaveAlt,
  faReceipt,
  faShoppingBag,
  faShoppingCart,
  faSignOutAlt,
  faTable,
  faTag,
  faTags,
  faTh,
  faThLarge,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import DarkModeIcon from '../../../components/Navigation/DarkModeIcon';
import NavAccountIcon from '../../../components/Navigation/NavAccountIcon';
import Logo from '../../../components/Logo';
import SideNavLink from '../SideNavLink';

import './style.scss';
import { removeAuth } from '../../../actions/AuthActions';
import { sendMessage } from '../../../events/MessageService';
import SideNavSubHeading from '../SideNavSubHeading';

interface Props {
  cookies: any;
  space: string;
}

const SideContent = (props: Props) => {
  const history = useHistory();
  const profile = useSelector((state: any) => state.profile);
  const authorization = useSelector((state: any) => state.authorization);
  const dispatch = useDispatch();

  const logout = (
    event: any,
    type = 'success',
    message = 'You have been logged out'
  ) => {
    dispatch(removeAuth());
    props.cookies.remove(
      `expenso_${process.env.REACT_APP_ONEAUTH_APPSPACE_ID}`
    );
    history.push(`/`);
    sendMessage('notification', true, {
      type,
      message,
      duration: 3000,
    });
  };

  const login = (type: string) => {
    window.location.href = `${process.env.REACT_APP_ONEAUTH_URL}/#/realm/${process.env.REACT_APP_ONEAUTH_APPSPACE_ID}/login/${process.env.REACT_APP_ONEAUTH_APP_ID}`;
  };

  const chooseCompany = () => {
    history.push('/home');
  };

  return (
    <div
      className={`side-content ${
        profile.sidebar
          ? 'side-content__sidebar-active'
          : 'side-content__sidebar-inactive'
      }`}
    >
      <div className="side-content__header">
        <div className="side-content__header__logo">
          <Logo />
        </div>
        {profile.sidebar && (
          <div className="side-content__header__button">
            <button className="button" onClick={chooseCompany}>
              <FontAwesomeIcon icon={faTh} />
            </button>
          </div>
        )}
      </div>
      <div className="side-content__menu">
        {props.space && (
          <>
            <SideNavSubHeading short="Record" long="Record" />
            <SideNavLink
              link={`/${props.space}/expense`}
              icon={faMoneyBillWave}
              label="Expense"
            />
            <SideNavLink
              link={`/${props.space}/bill/edit`}
              icon={faReceipt}
              label="Receipt"
            />
            <SideNavLink
              link={`/${props.space}/budget`}
              icon={faBalanceScaleRight}
              label="Budget"
            />
            <SideNavLink
              link={`/${props.space}/budget`}
              icon={faCalendarAlt}
              label="Recurring expense"
            />
            <SideNavLink
              link={`/${props.space}/category`}
              icon={faTags}
              label="Category and tag"
            />
            <SideNavSubHeading short="Report" long="Report" />
            <SideNavLink
              link={`/${props.space}/home`}
              icon={faChartBar}
              label="Dashboard"
            />
            <SideNavLink
              link={`/${props.space}/report`}
              icon={faTable}
              label="Report"
            />
            <SideNavSubHeading short="System" long="System" />
            <SideNavLink
              link={`/${props.space}/settings?link=general`}
              icon={faCogs}
              label="Company settings"
            />
            <SideNavLink
              link={`/${props.space}/settings?link=permissions`}
              icon={faUserShield}
              label="Users"
            />
            <SideNavLink
              link={`/${props.space}/settings?link=backup`}
              icon={faDatabase}
              label="Backup and restore"
            />
            {/* <SideNavLink
              link={`/${props.space}/settings?link=backup`}
              icon={faFileImport}
              label="Export and import"
            /> */}
          </>
        )}
      </div>
      <div className="side-content__footer">
        <div className="side-content__footer__left">
          {authorization.isAuth && (
            <button className="button" onClick={logout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
          )}
          {!authorization.isAuth && (
            <button className="button" onClick={login}>
              <FontAwesomeIcon icon={faFingerprint} />
            </button>
          )}
          {profile.sidebar && (
            <div>{`${authorization.given_name} ${authorization.family_name}`}</div>
          )}
        </div>
        {profile.sidebar && (
          <div className="side-content__footer__right">
            <DarkModeIcon />
          </div>
        )}
        {/* <NavAccountIcon logout={logout} login={login} /> */}
      </div>
    </div>
  );
};

export default SideContent;
