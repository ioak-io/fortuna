import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CategoryDistribution from '../DashboardElements/CategoryDistribution';
import './style.scss';

interface Props {
  history: any;
}

const Home = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);

  const goToLogin = () => {
    window.location.href = `${process.env.REACT_APP_ONEAUTH_URL}/#/realm/${process.env.REACT_APP_ONEAUTH_APPSPACE_ID}/login/${process.env.REACT_APP_ONEAUTH_APP_ID}`;
  };

  return (
    <div className="home page-width">
      {/* <ListSpaces history={props.history} /> */}
      <div className="content-section">
        <CategoryDistribution />
        <div />
      </div>
    </div>
  );
};

export default Home;
