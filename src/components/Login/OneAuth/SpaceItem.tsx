import React from 'react';
import './style.scss';

interface Props {
  space: any;
  history: any;
}

const SpaceItem = (props: Props) => {
  const oaLogin = () => {
    window.location.href = `${process.env.REACT_APP_ONEAUTH_URL}/#/space/${props.space.spaceId}/login?type=signin&appId=${process.env.REACT_APP_ONEAUTH_APP_ID}`;
  };
  return (
    <div className="space-list-item align-horizontal" onClick={oaLogin}>
      <div className="space-list-item--link">
        <div className="typography-6 space-horizontal-1">
          {props.space.name}
        </div>
      </div>
      ( <div className="typography-4">{props.space.spaceId}</div> )
    </div>
  );
};

export default SpaceItem;
