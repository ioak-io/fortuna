import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './style.scss';

interface Props {
  history: any;
}

const CategoryPage = (props: Props) => {
  const authorization = useSelector((state: any) => state.authorization);

  const goToLogin = () => {
    window.location.href = `${process.env.REACT_APP_ONEAUTH_URL}/#/realm/${process.env.REACT_APP_ONEAUTH_APPSPACE_ID}/login/${process.env.REACT_APP_ONEAUTH_APP_ID}`;
  };

  return (
    <div className="category-page">
      {/* <ListSpaces history={props.history} /> */}
      Welcome to category home
    </div>
  );
};

export default CategoryPage;
