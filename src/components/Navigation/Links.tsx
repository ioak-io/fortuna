import React from 'react';

import './Links.scss';
import { NavLink } from 'react-router-dom';
import OakButton from '../../oakui/OakButton';

interface Props {
  space: string;
}

const Links = (props: Props) => {
  return (
    <div className="links">
      <NavLink
        to={`/${props.space}/home`}
        className="navitem"
        activeClassName="active"
      >
        Home
      </NavLink>
      <NavLink
        to={`/${props.space}/project`}
        className="navitem"
        activeClassName="active"
      >
        Projects
      </NavLink>
      <NavLink
        to={`/${props.space}/email-server`}
        className="navitem"
        activeClassName="active"
      >
        Email Servers
      </NavLink>
      <NavLink
        to={`/${props.space}/template`}
        className="navitem"
        activeClassName="active"
      >
        Templates
      </NavLink>
    </div>
  );
};

export default Links;
