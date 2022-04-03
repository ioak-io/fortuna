import React, { useEffect, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import './style.scss';

import OakButton from '../../oakui/wc/OakButton';
import Logo from '../Logo';
import RightNav from '../Topbar/RightNav';
import { NavLink } from 'react-router-dom';

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

  const [currentpath, setCurrentpath] = useState('');

  useEffect(() => {
    history.listen((_history: any) => {
      console.log(currentpath, '((');
      setCurrentpath(_history.location.pathname);
    });
  }, []);

  const goToHome = () => {
    console.log(
      history.location.pathname,
      `navlink ${
        history.location.pathname === `/${props.space}/expense`
          ? 'navlink--active'
          : ''
      }`
    );
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
      <div className="navbar__left">
        <div>
          <Logo />
        </div>

        <div className="navbar__left__links">
          <NavLink
            to={`/${props.space}/home`}
            className="navlink"
            activeClassName="navlink--active"
          >
            Home
          </NavLink>
          <NavLink
            to={`/${props.space}/expense`}
            className="navlink"
            activeClassName="navlink--active"
          >
            Expense
          </NavLink>
          <NavLink
            to={`/${props.space}/category`}
            className="navlink"
            activeClassName="navlink--active"
          >
            Category
          </NavLink>
          <NavLink
            to={`/${props.space}/report`}
            className="navlink"
            activeClassName="navlink--active"
          >
            Report
          </NavLink>
        </div>
      </div>
      <div className="navbar--right">
        <RightNav cookies={props.cookies} />
      </div>
    </div>
  );
};

export default Navbar;
