import React, { useEffect, useState } from 'react';

import { Route, Routes } from 'react-router-dom';
import './RouterView.scss';
import Home from '../Home';
import { loginPageSubject } from '../../events/LoginPageEvent';
import ProtectedRouteApp from '../ProtectedRouteApp';
import LandingPage from '../Page/LandingPage';
import OaLogin from '../Auth/OaLogin';
import EditCompanyPage from '../Page/EditCompanyPage';
import UnauthorizedPage from '../Page/UnauthorizedPage';
import ExpensePage from '../Page/ExpensePage';
import DashboardPage from '../Page/DashboardPage';
import CategoryPage from '../Page/CategoryPage';
import ReceiptPage from '../Page/ReceiptPage';
import IncomePage from '../Page/IncomePage';
import EditBillPage from '../Page/EditBillPage';
import ScheduleReceiptPage from '../Page/ScheduleReceiptPage';
import EditScheduleReceiptPage from '../Page/EditScheduleReceiptPage';
import ScheduleReceiptRunbookPage from '../Page/ScheduleReceiptRunbookPage';
import BudgetPage from '../Page/BudgetPage';
import BalancePage from '../Page/BalancePage';
import DuplicatePage from '../Page/DuplicatePage';
import EditCompany from '../Page/SettingsPage/EditCompany';
import Permissions from '../Page/SettingsPage/Permissions';
import BackupAndRestore from '../Page/SettingsPage/BackupAndRestore';
import LoginPage from '../Page/LoginPage';

interface Props {
}

const RouterView = (props: Props) => {
  const [loginPage, setLoginPage] = useState(true);

  useEffect(() => {
    loginPageSubject.subscribe((message) => {
      setLoginPage(message.state);
    });
  }, []);

  return (
    <div
      className={`router-view ${loginPage ? 'on-login-page' : 'not-on-login-page'}`}
    >
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRouteApp
              middleware={['authenticate']} component={LandingPage} />
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRouteApp
              middleware={['authenticate']} component={LandingPage} />
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRouteApp
              middleware={[]} component={LoginPage} />}
        />
        <Route
          path="/company/edit"
          element={
            <ProtectedRouteApp
              middleware={['authenticate']} component={EditCompanyPage} />}
        />
        <Route
          path="/:space/unauthorized"
          element={
            <ProtectedRouteApp
              middleware={['isAuthenticated']} component={UnauthorizedPage} />}
        />
        <Route
          path="/:space/home"
          element={
            <ProtectedRouteApp
              middleware={['readAuthentication']} component={ExpensePage} />}
        />
        <Route
          path="/:space/dashboard"
          element={
            <ProtectedRouteApp
              middleware={['authenticate']} component={DashboardPage} />}
        />
        <Route
          path="/:space/category"
          element={
            <ProtectedRouteApp
              middleware={['authenticate']} component={CategoryPage} />}
        />
        <Route
          path="/:space/expense"
          element={
            <ProtectedRouteApp
              middleware={['authenticate']} component={ExpensePage} />}
        />
        <Route
          path="/:space/receipt"
          element={
            <ProtectedRouteApp
              middleware={['authenticate']} component={ReceiptPage} />}
        />
        <Route
          path="/:space/income"
          element={
            <ProtectedRouteApp
              middleware={['authenticate']} component={IncomePage} />}
        />
        <Route
          path="/:space/receipt/edit"
          element={
            <ProtectedRouteApp
              middleware={['authenticate']} component={EditBillPage} />}
        />
        <Route
          path="/:space/schedule/receipt"
          element={
            <ProtectedRouteApp
              middleware={['authenticate']} component={ScheduleReceiptPage} />}
        />
        <Route
          path="/:space/schedule/receipt/edit"
          element={
            <ProtectedRouteApp
              middleware={['authenticate']} component={EditScheduleReceiptPage} />}
        />
        <Route
          path="/:space/schedule/receipt/runbook"
          element={
            <ProtectedRouteApp
              middleware={['authenticate']} component={ScheduleReceiptRunbookPage} />}
        />
        <Route
          path="/:space/budget"
          element={
            <ProtectedRouteApp
              middleware={['authenticate']} component={BudgetPage} />}
        />
        <Route
          path="/:space/balance"
          element={
            <ProtectedRouteApp
              middleware={['authenticate']} component={BalancePage} />}
        />
        <Route
          path="/:space/duplicate"
          element={
            <ProtectedRouteApp
              middleware={['authenticate']} component={DuplicatePage} />}
        />
        <Route
          path="/:space/settings/company"
          element={
            <ProtectedRouteApp
              middleware={['authenticate']} component={EditCompany} />}
        />
        <Route
          path="/:space/settings/user"
          element={
            <ProtectedRouteApp
              middleware={['authenticate']} component={Permissions} />}
        />
        <Route
          path="/:space/settings/backup"
          element={
            <ProtectedRouteApp
              middleware={['authenticate']} component={BackupAndRestore} />}
        />
      </Routes>
    </div>
  );
};

export default RouterView;
