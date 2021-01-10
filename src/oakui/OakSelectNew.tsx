import { Code } from '@material-ui/icons';
import React, { useState } from 'react';
import OakButton from './OakButton';
import './styles/OakSelectNew.scss';

interface Props {
  id: string;
  label?: string;
  handleChange: any;
  error?: boolean;
  data: any;
  elements?: string[];
  objects?: Array<any>;
  disabled?: boolean;
  theme?: 'primary' | 'secondary' | 'tertiary' | 'default';
}

const OakSelectNew = (props: Props) => {
  const [show, setShow] = useState(false);

  const getStyle = () => {
    let style = props.theme ? props.theme : '';

    return style;
  };

  const change = event => {
    event.preventDefault();
    console.log(1);
  };

  return (
    <div className={`oak-select-new ${getStyle()}`}>
      <ul className="dropdown">
        <li className="dropdown__label">Label</li>

        <li role="button" id="dropdown__selected" tabIndex={0}>
          Option 1
        </li>

        <svg
          className="dropdown__arrow"
          width="10"
          height="5"
          viewBox="0 0 10 5"
          fill-rule="evenodd"
        >
          <path d="M10 0L5 5 0 0z"></path>
        </svg>

        <li className="dropdown__list-container">
          <ul className="dropdown__list">
            <li className="dropdown__list-item" id="option-1">
              Option 1
            </li>
            <li className="dropdown__list-item" id="option-2">
              Option 2
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default OakSelectNew;
