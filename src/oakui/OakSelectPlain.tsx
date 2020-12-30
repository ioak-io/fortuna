import React, { useState } from 'react';
import './styles/OakSelectPlain.scss';

interface Props {
  id: string;
  label?: string;
  handleChange: any;
  error?: boolean;
  data: any;
  elements?: string[];
  objects?: Array<any>;
  first?: string;
  firstAction?: string;
  disabled?: boolean;
  variant?: 'regular' | 'underline';
  theme?: 'primary' | 'secondary' | 'tertiary' | 'default';
  width?: 'width-25' | 'width-50' | 'width-75' | 'width-100';
}

const OakSelectPlain = (props: Props) => {
  const [show, setShow] = useState(false);

  const changeSelection = (e, newValue) => {
    e.target.name = props.id;
    e.target.value = newValue;
    props.handleChange(e);
    setShow(!show);
  };

  const getStyle = () => {
    let style = props.theme ? props.theme : '';
    style += props.variant ? ` ${props.variant}` : '';
    style += props.width ? ` ${props.width}` : '';

    return style;
  };

  let dropdownList: Array<any> = [];

  if (props.elements) {
    dropdownList = props.elements.map(item => (
      <div
        className="option"
        key={item}
        onClick={e => changeSelection(e, item)}
      >
        {item}
      </div>
    ));
  } else if (props.objects) {
    dropdownList = props.objects.map(item => (
      <div
        className="option"
        key={item.key}
        onClick={e => changeSelection(e, item.key)}
      >
        {item.value}
      </div>
    ));
  }

  return (
    <div className={`oak-select-plain ${getStyle()}`}>
    {props.label && (
      <label
        htmlFor={props.id}
        className={props.data[props.id] ? 'active' : ''}
      >
        {props.label}
      </label>
    )}
      <select
        onChange={props.handleChange}
        name={props.id}
        className={`select ${getStyle()}`}
        value={props.data[props.id]}
        disabled={props.disabled}
      >
        <option value=""> </option>
        {props.firstAction && (
          <option value={props.firstAction}>{props.firstAction}</option>
        )}
        {props.elements?.map(item => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
        {props.objects?.map(item => (
          <option value={item.key} key={item.key}>
            {item.value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OakSelectPlain;
