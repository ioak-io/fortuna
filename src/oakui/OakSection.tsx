import React, { useState, useEffect } from 'react';
import './styles/oak-section-expenso.scss';

interface Props {
  children?: any;
  title?: string;
  subtitle?: string;
  outer?: boolean;
}

const OakSection = (props: Props) => {
  return (
    <>
      {!props.outer && (
        <div className="oak-section">
          {(props.title || props.subtitle) && (
            <div
              className={`oak-section--header-${
                props.title ? 'highlight' : 'basic'
              }`}
            >
              {props.title && (
                <div className="oak-section--header--title">{props.title}</div>
              )}
              {!props.title && props.subtitle && (
                <div className="oak-section--header--subtitle">
                  {props.subtitle}
                </div>
              )}
            </div>
          )}
          <div className="oak-section--body">
            <div className="oak-section--app-text">{props.children}</div>
          </div>
        </div>
      )}
      {props.outer && <div className="oak-section-outer">{props.children}</div>}
    </>
  );
};

export default OakSection;
