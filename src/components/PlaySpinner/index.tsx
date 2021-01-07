import React from 'react';
import OakHeading from '../../oakui/OakHeading';
import OakSection from '../../oakui/OakSection';
import OakSpinner from '../../oakui/OakSpinner';
import SpinnerDemo from './SpinnerDemo';
import './style.scss';

interface Props {
  match: any;
  history: any;
}

const PlaySpinner = (props: Props) => {
  return (
    // <div className="home full">
    //   <div className="space-bottom-4">
    //     Copy below token as Authorization key on the request header from postman
    //   </div>
    //   <div className="auth-token">{authorization.token}</div>
    // </div>
    <>
    {/* <OakSpinner style="bouncing-dots" /> */}
      <OakSection outer>
        <OakHeading
          title="Oak UI Playground"
          subtitle="Demo on how the newly created OAK UI components work"
        />
      </OakSection>
      <SpinnerDemo />
    </>
  );
};

export default PlaySpinner;
