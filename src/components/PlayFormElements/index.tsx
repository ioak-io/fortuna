import React from 'react';
import OakHeading from '../../oakui/OakHeading';
import OakCard from '../../oakui/OakCard';
import FileInput from './FileInput';
import SelectInput from './SelectInput';
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
      <OakCard outer>
        <OakHeading title="Form Elements" />
      </OakCard>
      <SelectInput />
      <SelectInput />
      <SelectInput />
      <SelectInput />
      <SelectInput />
      <FileInput />
    </>
  );
};

export default PlayFormElements;
