import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import './styles/oak-button.scss';

interface Props {
  action?: any;
  variant?:
    | 'block'
    | 'outline'
    | 'appear'
    | 'disappear'
    | 'regular'
    | 'disabled'
    | 'drama';
  theme?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'default'
    | 'danger'
    | 'warning'
    | 'success'
    | 'info';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  shape?: 'sharp' | 'rectangle' | 'rounded' | 'leaf' | 'icon';
  align?: 'left' | 'right' | 'center';
  children?: ReactNode;
  type?: 'button' | 'submit' | 'link';
}

const OakButton = (props: Props) => {
  const profile = useSelector(state => state.profile);
  const getStyle = () => {
    let style = props.theme ? props.theme : '';
    style += profile?.theme?.includes('theme_light') ? ' light' : ' dark';
    style += props.variant ? ` ${props.variant}` : '';

    if (props.shape === 'icon') {
      style += ' icon';
    }

    style += props.align ? ` align-${props.align}` : '';

    style += props.size ? ` size-${props.size}` : ' size-small';

    style += props.shape ? ` shape-${props.shape}` : ' shape-rectangle';

    return style;
  };

  return (
    // eslint-disable-next-line react/button-has-type
    <button
      className={`oak-button ${getStyle()}`}
      onClick={props.action}
      disabled={props.variant === 'disabled'}
    >
      <div className="button-label-container">
        {props.children && props.children}
      </div>
    </button>
  );
};

export default OakButton;
