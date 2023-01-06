import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';

import './Tag.scss';
import OakClickArea from '../../../oakui/wc/OakClickArea';

interface Props {
  tag: string;
  handleClick?: any;
}

const Tag = (props: Props) => {
  return (
    <div className="tag">
      <OakClickArea handleClick={props.handleClick}>
        <div className="tag__content">
          {/* <div className="tag__content__icon">
            <FontAwesomeIcon icon={faTag} />
          </div> */}
          <div className="tag__content__name">{props.tag}</div>
        </div>
      </OakClickArea>
    </div>
  );
};

export default Tag;
