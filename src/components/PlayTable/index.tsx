import React from 'react';
import OakHeading from '../../oakui/OakHeading';
import OakSection from '../../oakui/OakSection';
import './style.scss';
import TableDemo from './TableDemo';

interface Props {
  match: any;
  history: any;
}

const PlayTable = (props: Props) => {
  return (
    // <div className="home full">
    //   <div className="space-bottom-4">
    //     Copy below token as Authorization key on the request header from postman
    //   </div>
    //   <div className="auth-token">{authorization.token}</div>
    // </div>
    <>
      <OakSection outer>
        <OakHeading title="Table" />
      </OakSection>
      <TableDemo />
    </>
  );
};

export default PlayTable;
