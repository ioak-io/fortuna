import React from 'react';
import OakHeading from '../../oakui/OakHeading';
import OakSection from '../../oakui/OakSection';
import ButtonDemo from './ButtonDemo';
import ChartDemo from './ChartDemo';
import ModalDemo from './ModalDemo';
import './style.scss';
import TableDemo from './TableDemo';

interface Props {
  match: any;
  history: any;
}

const Home = (props: Props) => {
  return (
    // <div className="home full">
    //   <div className="space-bottom-4">
    //     Copy below token as Authorization key on the request header from postman
    //   </div>
    //   <div className="auth-token">{authorization.token}</div>
    // </div>
    <>
      <OakSection outer>
        <OakHeading title="UI elements demo" subtitle="Demo on how the newly created OAK UI components work" />
      </OakSection>
      <ButtonDemo />
      <TableDemo />
      <ModalDemo />
      <ChartDemo />
    </>
  );
};

export default Home;
