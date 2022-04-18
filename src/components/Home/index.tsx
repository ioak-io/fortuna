import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CategoryDistribution from '../DashboardElements/CategoryDistribution';
import Topbar from '../Topbar';
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
    <div className="home">
      <Topbar title="Dashboard">right</Topbar>
      <div className="main-section home__main">
        <div className="home__main__two-column">
          <div className="home__main__chart">
            <CategoryDistribution />
          </div>
          <div className="home__main__chart">
            <CategoryDistribution />
          </div>
        </div>
        <div className="home__main__multi-column">
          <div className="">100</div>
          <div className="">200</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
