import {
  faBalanceScaleRight,
  faCalendarAlt,
  faChartArea,
  faChartBar,
  faClone,
  faCog,
  faCogs,
  faCoins,
  faCopy,
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
  faUniversity,
  faUserShield,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DarkModeIcon from '../../../components/Navigation/DarkModeIcon';
import NavAccountIcon from '../../../components/Navigation/NavAccountIcon';
import Logo from '../../../components/Logo';
import SideNavLink from '../SideNavLink';

import './style.scss';
import { removeAuth } from '../../../store/actions/AuthActions';
import { sendMessage } from '../../../events/MessageService';
import SideNavSubHeading from '../SideNavSubHeading';
import { removeSessionValue } from '../../../utils/SessionUtils';
import { useNavigate } from 'react-router-dom';

interface Props {
  space: string;
}

const SideContent = (props: Props) => {
  const navigate = useNavigate();
  const profile = useSelector((state: any) => state.profile);
  const authorization = useSelector((state: any) => state.authorization);
  const dispatch = useDispatch();

  const logout = (
    event: any,
    type = 'success',
    message = 'You have been logged out'
  ) => {
    dispatch(removeAuth());
    removeSessionValue(
      `fortuna_${process.env.REACT_APP_ONEAUTH_APPSPACE_ID}`
    );
    navigate(`/`);
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
    navigate('/home');
  };

  return (
    <div
      className={`side-content ${
        profile.sidebar
          ? 'side-content__sidebar-active'
          : 'side-content__sidebar-inactive'
      } ${
        profile.theme === 'basicui-dark'
          ? 'side-content__theme-dark'
          : 'side-content__theme-light'
      }`}
    >
      <div className="side-content__header">
        <div className="side-content__header__logo">
          <Logo variant={profile.sidebar ? 'full' : 'short'} />
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
            {/* <SideNavSubHeading short="Record" long="Record" /> */}
            <SideNavLink
              link={`/${props.space}/dashboard`}
              icon={faChartBar}
              label="Dashboard"
            />
            <SideNavLink
              link={`/${props.space}/expense`}
              icon={faMoneyBillWave}
              label="Expense"
            />
            <SideNavLink
              link={`/${props.space}/receipt`}
              icon={faReceipt}
              label="Receipt"
            />
            <SideNavLink
              link={`/${props.space}/income`}
              icon={faCoins}
              label="Income"
            />
            <SideNavLink
              link={`/${props.space}/budget`}
              icon={faBalanceScaleRight}
              label="Budget"
            />
            <SideNavLink
              link={`/${props.space}/balance`}
              icon={faWallet}
              label="Balance"
            />
            <SideNavLink
              link={`/${props.space}/category`}
              icon={faTags}
              label="Categories and tags"
            />
            <SideNavLink
              link={`/${props.space}/schedule/receipt`}
              icon={faCalendarAlt}
              label="Schedule transaction"
            />
            <SideNavLink
              link={`/${props.space}/duplicate`}
              icon={faCopy}
              label="Duplicate transaction"
            />
            <SideNavSubHeading short="System" long="System" />
            <SideNavLink
              link={`/${props.space}/settings/company`}
              icon={faCogs}
              label="Company setting"
            />
            <SideNavLink
              link={`/${props.space}/settings/user`}
              icon={faUserShield}
              label="User"
            />
            <SideNavLink
              link={`/${props.space}/settings/backup`}
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
            <button className="button" onClick={() => login('signin')}>
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
