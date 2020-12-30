import React, { useState, useEffect, ReactElement } from 'react';
import './styles/oak-tab.scss';
import { useLocation } from 'react-router';
import { isEmptyOrSpaces } from '../components/Utils';

interface Props {
  meta: any[];
  children: any;
  variant?: 'default' | 'fullpage';
  noBookmarking?: boolean;
}

const OakTab = (props: Props) => {
  const [activeTab, setActiveTab] = useState('');
  const [slots, setSlots] = useState<any | {}>({});
  const location = useLocation();

  useEffect(() => {
    initializeViews();
  }, [props.meta, props.children]);

  useEffect(() => {
    if (!props.noBookmarking) {
      setActiveTab(
        isEmptyOrSpaces(location.hash)
          ? props.meta[0]?.slotName
          : location.hash.substr(1)
      );
    }
  }, [location.hash]);

  const initializeViews = () => {
    let newSlots = {};
    React.Children.toArray(props.children).forEach((node: any) => {
      newSlots = { ...newSlots, [node.props.slot]: node };
    });
    setSlots(newSlots);
    if (props.noBookmarking && !activeTab) {
      setActiveTab(Object.keys(newSlots)[0]);
    }
  };

  return (
    <div className={`oak-tab ${props.variant}`}>
      <div className="oak-tab--header">
        {props.noBookmarking &&
          props.meta.map(item => (
            <button
              key={item.slotName}
              className={`oak-tab--header--button tab typography-6 ${
                activeTab === item.slotName ? 'active' : 'inactive'
              }`}
              onClick={event => setActiveTab(item.slotName)}
            >
              {/* <div className="icon"> */}
              <i
                className={`material-icons typography-8 ${
                  activeTab === item.slotName ? 'active' : ''
                }`}
              >
                {item.icon}
              </i>
              <div className="label">{item.label}</div>
            </button>
          ))}

        {!props.noBookmarking &&
          props.meta.map(item => (
            <a
              key={item.slotName}
              className={`tab typography-6 ${
                activeTab === item.slotName ? 'active' : 'inactive'
              }`}
              // onClick={event => switchTab(event, item.slotName)}
              // href={`#${item.slotName}`}
              href={`#${location.pathname}${location.search}#${item.slotName}`}
            >
              {/* <div className="icon"> */}
              <i
                className={`material-icons typography-8 ${
                  activeTab === item.slotName ? 'active' : ''
                }`}
              >
                {item.icon}
              </i>
              <div className="label">{item.label}</div>
            </a>
          ))}
      </div>
      {/* {props.meta.map(item => (
        <div
          key={item.slotName}
          className={`tab typography-6 ${
            activeTab === item.slotName ? 'active' : ''
          }`}
          onClick={event => switchTab(event, item.slotName)}
        />
      ))} */}
      {props.meta.map(item => (
        <div
          key={item.slotName}
          className={`content ${
            activeTab === item.slotName ? 'active' : 'inactive'
          }`}
        >
          {slots[activeTab]}
          {/* <slot v-bind:name="item.slotName" /> */}
        </div>
      ))}
    </div>
  );
};

export default OakTab;
