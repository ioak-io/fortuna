import { ExpandMore } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getProfile, setProfile } from '../../actions/ProfileActions';
import { newId, receiveMessage, sendMessage } from '../../events/MessageService';

import './NavGroup.scss';
import NavItem from './NavItem';

interface Props {
  space: string;
  closeAfterRouteChange?: boolean;
  label: string;
  children: any;
  context?: string;
  //   history: any;
  //   cookies: any;
  //   location: any;
  //   match: any;
}

const NavGroup = (props: Props) => {
  const [instanceId, setInstanceId] = useState(newId());
  const [isExpanded, setIsExpanded] = useState(false);
  const authorization = useSelector(state => state.authorization);

  const profile = useSelector(state => state.profile);

  const dispatch = useDispatch();

  useEffect(() => {
    updateScrollHeight();
    receiveMessage().subscribe(message => {
      if (message.name === 'nav-group-expanded' && message.signal && message.data.context === props.context && message.data.instanceId != instanceId) {
        setIsExpanded(false);
      }
    })
  }, []);

  useEffect(() => {
    updateScrollHeight();
  }, [isExpanded]);

  const updateScrollHeight = () => {
    const element = document.getElementById(instanceId);
    if (element) {
      element.style.maxHeight = isExpanded ? `${element.scrollHeight}px` : '0px';
    }
  };

  const toggleExpansion = () => {
    if (!isExpanded) {
      setIsExpanded(!isExpanded);
      setTimeout(() => {sendMessage('nav-group-expanded', true, {instanceId, context: props.context})}, 100);
    } else {
      setIsExpanded(!isExpanded);
    }
  }

  return (
    <div className="nav-group">
      <a
        href="javascript:undefined;"
        className={`nav-group--headline ${isExpanded ? 'expanded' : 'collapsed'}`}
        onClick={toggleExpansion}
      >
        <div>{props.label}</div>
        <div>
          <ExpandMore
            className={`material-icons ${isExpanded ? 'showless' : 'showmore'}`}
          />
        </div>
      </a>
      <div className={`nav-group--container`} id={instanceId}>
        {props.children}
      </div>
    </div>
  );
};

export default NavGroup;
