import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import './styles/oak-link.scss';

interface Props {
  icon?: string; // points to "mat" material icon
  fa?: string;
  svg?: string;
  action?: any;
  variant?:
    | 'block'
    | 'outline'
    | 'appear'
    | 'disappear'
    | 'regular'
    | 'disabled'
    | 'drama';
  theme?: 'primary' | 'secondary' | 'tertiary' | 'default';
  align?: 'left' | 'right' | 'center';
  small?: boolean;
  invert?: boolean;
  children?: ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

const OakLink = (props: Props) => {
  const profile = useSelector(state => state.profile);
  const getStyle = () => {
    let style = props.theme ? props.theme : '';
    style += profile?.theme?.includes('theme_light') ? ' light' : '';
    style += props.variant ? ` ${props.variant}` : '';

    if (!props.children) {
      style += ' icon';
    }

    style += props.invert ? ' invert' : '';

    style += props.small ? ' small' : '';

    style += props.align ? ` align-${props.align}` : '';

    return style;
  };

  return (
    // eslint-disable-next-line react/button-has-type
    <a
      href="javascript:undefined;"
      className={`oak-link ${getStyle()}`}
      onClick={props.action}
    >
      <div className="link-label-container">
        {props.children && (
          <div className="link-label-container--text">{props.children}</div>
        )}
      </div>
    </a>
  );
};

export default OakLink;
