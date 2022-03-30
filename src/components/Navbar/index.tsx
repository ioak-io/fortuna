import React, { useEffect, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import './style.scss';

import OakButton from '../../oakui/wc/OakButton';
import Logo from '../Logo';
import RightNav from '../Topbar/RightNav';

interface Props {
  space: string;
  cookies: any;
  //   location: any;
  //   match: any;
  hideSidebarOnDesktop?: boolean;
}

const Navbar = (props: Props) => {
  const history = useHistory();
  const authorization = useSelector((state: any) => state.authorization);

  const profile = useSelector((state: any) => state.profile);

  const dispatch = useDispatch();

  const goToHome = () => {
    history.push(`/${props.space}/home`);
  };

  const goToExpensePage = () => {
    history.push(`/${props.space}/expense`);
  };
  const goToCategoryPage = () => {
    history.push(`/${props.space}/category`);
  };

  const newArticle = () => {
    history.push(`/${props.space}/article/create`);
  };

  return (
    <div className="navbar">
      <div className="navbar--left">
        <div>
          <Logo />
        </div>
        <OakButton
          theme="default"
          shape="sharp"
          variant="outline"
          handleClick={goToHome}
        >
          Home
        </OakButton>
        <OakButton
          theme="default"
          shape="sharp"
          variant="outline"
          handleClick={goToExpensePage}
        >
          Expense
        </OakButton>
        <OakButton
          theme="default"
          shape="sharp"
          variant="outline"
          handleClick={goToCategoryPage}
        >
          Category
        </OakButton>
        <OakButton
          theme="default"
          shape="sharp"
          variant="outline"
          handleClick={goToCategoryPage}
        >
          Report
        </OakButton>
      </div>
      <div className="navbar--right">
        <RightNav cookies={props.cookies} />
      </div>
    </div>
  );
};

export default Navbar;
