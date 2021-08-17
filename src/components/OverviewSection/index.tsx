import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import './style.scss';
import OakTypography from '../../oakui/wc/OakTypography';
import KeyDetails from './KeyDetails';

interface Props {
  data: {
    title: string;
    componentName: string;
    composerName: string;
    sections: {
      heading?: string;
      body: string;
    }[];
  };
}

const OverviewSection = (props: Props) => {
  return (
    <>
      <KeyDetails data={props.data} />
      <div className="overview-section">
        {props.data?.sections?.map((content, index) => (
          <div key={content.heading || index}>
            {content.heading && (
              <OakTypography variant="h6">{content.heading}</OakTypography>
            )}
            <OakTypography variant="body2">{content.body}</OakTypography>
          </div>
        ))}
      </div>
    </>
  );
};

export default OverviewSection;
