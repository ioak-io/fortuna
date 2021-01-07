import React from 'react';
import OakHeading from '../../oakui/OakHeading';
import OakSection from '../../oakui/OakSection';
import FileInput from './FileInput';
import './style.scss';

interface Props {
  match: any;
  history: any;
}

const PlayFormElements = (props: Props) => {
  return (
    // <div className="home full">
    //   <div className="space-bottom-4">
    //     Copy below token as Authorization key on the request header from postman
    //   </div>
    //   <div className="auth-token">{authorization.token}</div>
    // </div>
    <>
      <OakSection outer>
        <OakHeading title="Form Elements" />
      </OakSection>
      <FileInput />
    </>
  );
};

export default PlayFormElements;
