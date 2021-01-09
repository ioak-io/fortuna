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
  }

  return (
    <div className={`oak-select-new ${getStyle()}`}>
      <OakButton
        theme="primary"
        variant="regular"
        action={() => setShow(!show)}
      >
        Choose from below
      </OakButton>
      <div className="cursor-pointer">
      <Code onClick={() => setShow(!show)} />
      </div>
      <ul className={`dropdown ${show ? 'visible' : 'hidden'}`}>
        
          <li>lorem start</li>
        {props.elements?.map(item => (
          <li><a href="" onClick={change}>lorem</a></li>
        ))}
        {props.elements?.map(item => (
          <li><a href="">lorem ipsum dolor sit lorem ipsum dolor sit lorem ipsum dolor sit lorem ipsum dolor sit lorem ipsum dolor sit lorem ipsum dolor sit lorem ipsum dolor sit </a></li>
        ))}
        {props.elements?.map(item => (
          <li><a href="">lorem</a></li>
        ))}
        {props.elements?.map(item => (
          <li><a href="">lorem</a></li>
        ))}
        {props.elements?.map(item => (
          <li><a href="">lorem</a></li>
        ))}
        {props.elements?.map(item => (
          <li><a href="">lorem</a></li>
        ))}
        {props.elements?.map(item => (
          <li><a href="">lorem</a></li>
        ))}
        {props.elements?.map(item => (
          <li><a href="">lorem</a></li>
        ))}
        {props.elements?.map(item => (
          <li><a href="">lorem</a></li>
        ))}
        {props.elements?.map(item => (
          <li><a href="">lorem</a></li>
        ))}
        {props.elements?.map(item => (
          <li><a href="">lorem</a></li>
        ))}
          <li>lorem end</li>
      </ul>
    </div>
  );
};

export default OakSelectNew;
